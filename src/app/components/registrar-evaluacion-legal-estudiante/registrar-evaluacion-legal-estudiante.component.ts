// src/app/components/registrar-evaluacion-legal-estudiante/registrar-evaluacion-legal-estudiante.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { forkJoin, of, switchMap, catchError } from 'rxjs';

import { EstudianteClaseService } from '../../services/estudiante-clase/estudiante-clase.service';
import { InscripcionTrimestralService } from '../../services/inscripcion-trimestral/inscripcion-trimestral.service';
import { EvaluacionLegalService } from '../../services/evaluacion-legal/evaluacion-legal.service';
import { Estudiante } from '../../models/estudiante-clase/estudiante-clase.model';
import { EstudianteEvaluacionLegal } from '../../models/estudiante-evaluacion-legal/estudiante-evaluacion-legal.model';
import { environment } from '../../../environments/environment';

interface NotasEntrada {
  nota_saber_evaluacion_profesor: number;
  nota_hacer_evaluacion_profesor: number;
  nota_ser_evaluacion_profesor: number;
  nota_decidir_evaluacion_profesor: number;
  nota_ser_evaluacion_estudiante: number;
  nota_decidir_evaluacion_estudiante: number;
}

@Component({
  selector: 'app-registrar-evaluacion-legal-estudiante',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registrar-evaluacion-legal-estudiante.component.html',
  styleUrls: ['./registrar-evaluacion-legal-estudiante.component.scss']
})
export class RegistrarEvaluacionLegalEstudianteComponent implements OnInit {
  gestion = '';
  cursoId = 0;
  profesorId = 0;
  materiaId = 0;

  estudiantes: Estudiante[] = [];
  notasPorEstudiante: { [idEstudiante: number]: NotasEntrada } = {};

  cargando = false;
  mensajeExito = '';
  mensajeError = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private estudianteService: EstudianteClaseService,
    private inscripcionService: InscripcionTrimestralService,
    private evalLegalService: EvaluacionLegalService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.gestion = params['gestion_academica_trimestral'] || '';
      this.cursoId = +params['curso_id'] || 0;
      this.profesorId = +params['profesor_id'] || 0;
      this.materiaId = +params['materia_id'] || 0;
      this.cargarEstudiantes();
    });
  }

  private cargarEstudiantes(): void {
    // 1) Traer la lista de estudiantes
    this.estudianteService
      .getEstudiantes({
        gestion_academica_trimestral: this.gestion,
        curso_id: this.cursoId,
        profesor_id: this.profesorId,
        materia_id: this.materiaId
      })
      .pipe(
        switchMap(lista => {
          this.estudiantes = lista;

          // Inicializamos notasPorEstudiante con ceros para todos
          this.estudiantes.forEach(e => {
            this.notasPorEstudiante[e.id] = {
              nota_saber_evaluacion_profesor: 0,
              nota_hacer_evaluacion_profesor: 0,
              nota_ser_evaluacion_profesor: 0,
              nota_decidir_evaluacion_profesor: 0,
              nota_ser_evaluacion_estudiante: 0,
              nota_decidir_evaluacion_estudiante: 0
            };
          });

          // 2) Pedimos la lista de “estudiantes-evaluaciones-legales” para precargar datos
          return this.http.get<EstudianteEvaluacionLegal[]>(
            `${environment.apiUrl}/estudiantes-evaluaciones-legales/?` +
            `gestion_academica_trimestral=${this.gestion}` +
            `&curso_id=${this.cursoId}` +
            `&profesor_id=${this.profesorId}` +
            `&materia_id=${this.materiaId}`
          );
        }),
        catchError(err => {
          console.error('Error al cargar estudiantes o evaluaciones:', err);
          this.mensajeError = 'No se pudo obtener la lista de estudiantes o evaluaciones.';
          // En caso de error, devolvemos array vacío para continuar con lista de estudiantes
          return of([] as EstudianteEvaluacionLegal[]);
        })
      )
      .subscribe({
        next: (resArr: EstudianteEvaluacionLegal[]) => {
          resArr.forEach(item => {
            const idEst = item.estudiante.id;
            const ev = item.evaluacion_legal;
            // Si hay datos previos, precargamos en notasPorEstudiante
            if (ev && this.notasPorEstudiante.hasOwnProperty(idEst)) {
              this.notasPorEstudiante[idEst] = {
                nota_saber_evaluacion_profesor:    parseFloat(ev.nota_saber_evaluacion_profesor),
                nota_hacer_evaluacion_profesor:    parseFloat(ev.nota_hacer_evaluacion_profesor),
                nota_ser_evaluacion_profesor:      parseFloat(ev.nota_ser_evaluacion_profesor),
                nota_decidir_evaluacion_profesor:  parseFloat(ev.nota_decidir_evaluacion_profesor),
                nota_ser_evaluacion_estudiante:    parseFloat(ev.nota_ser_evaluacion_estudiante),
                nota_decidir_evaluacion_estudiante: parseFloat(ev.nota_decidir_evaluacion_estudiante)
              };
            }
          });
        },
        error: err => {
          console.error('Error en subscribe cargarEvaluacionesPrevias:', err);
          this.mensajeError = 'Error al precargar datos de evaluación legal.';
        }
      });
  }

  private calcularNotasDerivadas(notas: NotasEntrada): {
    nota_evaluacion_profesor: string;
    nota_evaluacion_estudiante: string;
    nota_evaluacion_legal: string;
  } {
    // Cálculo de las notas tal como antes, pero con validación de que siempre reciba un objeto válido
    const ne_prof =
      (notas.nota_saber_evaluacion_profesor * 0.35) +
      (notas.nota_hacer_evaluacion_profesor * 0.35) +
      (notas.nota_decidir_evaluacion_profesor * 0.10) +
      (notas.nota_ser_evaluacion_profesor * 0.10);

    const ne_est =
      (notas.nota_ser_evaluacion_estudiante * 0.50) +
      (notas.nota_decidir_evaluacion_estudiante * 0.50);

    const ne_legal = (ne_prof * 0.90) + (ne_est * 0.10);

    const formatear = (n: number) => n.toFixed(2);

    return {
      nota_evaluacion_profesor: formatear(ne_prof),
      nota_evaluacion_estudiante: formatear(ne_est),
      nota_evaluacion_legal: formatear(ne_legal)
    };
  }

  guardarTodasEvaluaciones(): void {
    this.cargando = true;
    this.mensajeExito = '';
    this.mensajeError = '';

    const llamadas$ = this.estudiantes.map(est => {
      return this.inscripcionService
        .getId({
          gestion_academica_trimestral: this.gestion,
          curso_id: this.cursoId,
          profesor_id: this.profesorId,
          materia_id: this.materiaId,
          estudiante_id: est.id
        })
        .pipe(
          switchMap(res => {
            const idIns = res.id_inscripcion_trimestral;
            const notasEntrada = this.notasPorEstudiante[est.id];
            const derivadas = this.calcularNotasDerivadas(notasEntrada);

            const payload = {
              nota_saber_evaluacion_profesor:    notasEntrada.nota_saber_evaluacion_profesor.toFixed(2),
              nota_hacer_evaluacion_profesor:    notasEntrada.nota_hacer_evaluacion_profesor.toFixed(2),
              nota_ser_evaluacion_profesor:      notasEntrada.nota_ser_evaluacion_profesor.toFixed(2),
              nota_decidir_evaluacion_profesor:  notasEntrada.nota_decidir_evaluacion_profesor.toFixed(2),

              nota_ser_evaluacion_estudiante:    notasEntrada.nota_ser_evaluacion_estudiante.toFixed(2),
              nota_decidir_evaluacion_estudiante: notasEntrada.nota_decidir_evaluacion_estudiante.toFixed(2),

              nota_evaluacion_profesor:    derivadas.nota_evaluacion_profesor,
              nota_evaluacion_estudiante:  derivadas.nota_evaluacion_estudiante,
              nota_evaluacion_legal:       derivadas.nota_evaluacion_legal,

              inscripcion_trimestre: idIns
            };

            // 1) Pedimos la lista de estudiantes-evaluaciones-legales
            return this.http
              .get<EstudianteEvaluacionLegal[]>(
                `${environment.apiUrl}/estudiantes-evaluaciones-legales/?` +
                `gestion_academica_trimestral=${this.gestion}&` +
                `curso_id=${this.cursoId}&` +
                `profesor_id=${this.profesorId}&` +
                `materia_id=${this.materiaId}`
              )
              .pipe(
                switchMap((resArr: EstudianteEvaluacionLegal[] | null) => {
                  // Forzamos a array si viene null
                  const arraySeguro = resArr || [];

                  // 2) Buscamos si existe un item con evaluacion_legal.inscripcion_trimestre === idIns
                  const encontrado = arraySeguro.find(
                    x => x.evaluacion_legal?.inscripcion_trimestre === idIns
                  );

                  if (encontrado && encontrado.evaluacion_legal) {
                    // Ya existe → PATCH
                    const evaluacionId = encontrado.evaluacion_legal.id;
                    return this.http.patch(
                      `${environment.apiUrl}/evaluaciones_legales/${evaluacionId}/`,
                      payload
                    );
                  } else {
                    // No existe → POST
                    return this.evalLegalService.crearEvaluacionLegal(payload);
                  }
                })
              );
          }),
          catchError(err => {
            console.error(`Error procesando estudiante ${est.id}:`, err);
            return of(null);
          })
        );
    });

    forkJoin(llamadas$).subscribe({
      next: _ => {
        this.cargando = false;
        this.mensajeExito = 'Todas las evaluaciones legales se procesaron correctamente.';
        this.router.navigate(
          ['/profesor/estudiante-evaluacion-legal'],
          {
            queryParams: {
              gestion_academica_trimestral: this.gestion,
              curso_id: this.cursoId,
              profesor_id: this.profesorId,
              materia_id: this.materiaId
            }
          }
        );
      },
      error: err => {
        console.error('Error al procesar evaluaciones legales:', err);
        this.cargando = false;
        this.mensajeError = 'Ocurrió un error al procesar las evaluaciones legales.';
      }
    });
  }
}
