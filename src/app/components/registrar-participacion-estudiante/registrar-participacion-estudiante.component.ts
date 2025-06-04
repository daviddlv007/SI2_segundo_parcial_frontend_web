// src/app/components/registrar-participacion-estudiante/registrar-participacion-estudiante.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { forkJoin, of, switchMap, catchError } from 'rxjs';

import { EstudianteClaseService } from '../../services/estudiante-clase/estudiante-clase.service';
import { InscripcionTrimestralService } from '../../services/inscripcion-trimestral/inscripcion-trimestral.service';
import { ParticipacionService } from '../../services/participacion/participacion.service';
import { Estudiante } from '../../models/estudiante-clase/estudiante-clase.model';
import { EstudianteParticipacion } from '../../models/estudiante-participacion/estudiante-participacion.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-registrar-participacion-estudiante',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registrar-participacion-estudiante.component.html',
  styleUrls: ['./registrar-participacion-estudiante.component.scss']
})
export class RegistrarParticipacionEstudianteComponent implements OnInit {
  gestion = '';
  cursoId = 0;
  profesorId = 0;
  materiaId = 0;

  estudiantes: Estudiante[] = [];
  participoPorEstudiante: { [idEstudiante: number]: boolean } = {};
  fechaHoy = '';

  cargando = false;
  mensajeExito = '';
  mensajeError = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private estudianteService: EstudianteClaseService,
    private inscripcionService: InscripcionTrimestralService,
    private participacionService: ParticipacionService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.gestion = params['gestion_academica_trimestral'] || '';
      this.cursoId = +params['curso_id'] || 0;
      this.profesorId = +params['profesor_id'] || 0;
      this.materiaId = +params['materia_id'] || 0;
      this.fechaHoy = this.obtenerFechaHoyIso();
      this.cargarEstudiantesConParticipacionesPrevias();
    });
  }

  private obtenerFechaHoyIso(): string {
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd = String(hoy.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  /**
   * Carga la lista de estudiantes y, seguidamente, 
   * precarga en `participoPorEstudiante[id]` el valor true/false
   * si ya existe una participación para "hoy" en esta clase.
   */
  private cargarEstudiantesConParticipacionesPrevias(): void {
    // 1) Obtener listado de estudiantes
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
          // Inicializamos a false por defecto
          this.estudiantes.forEach(e => {
            this.participoPorEstudiante[e.id] = false;
          });

          // 2) Buscar en la API si ya hay participaciones para "hoy"
          return this.http.get<EstudianteParticipacion[]>(
            `${environment.apiUrl}/estudiantes-participaciones/?` +
            `gestion_academica_trimestral=${this.gestion}&` +
            `curso_id=${this.cursoId}&` +
            `profesor_id=${this.profesorId}&` +
            `materia_id=${this.materiaId}`
          );
        })
      )
      .subscribe({
        next: (resArr: EstudianteParticipacion[]) => {
          // Para cada elemento, si hay participaciones cuyo campo 'fecha' == fechaHoy, marcamos true/false
          resArr.forEach(item => {
            const idEst = item.estudiante.id;
            // Buscamos en `item.participaciones` si hay un objeto con fecha == fechaHoy
            const encontradoHoy = item.participaciones.find(
              p => p.fecha === this.fechaHoy
            );
            if (encontradoHoy) {
              this.participoPorEstudiante[idEst] = encontradoHoy.participo;
            }
          });
        },
        error: err => {
          console.error('Error al cargar participaciones previas:', err);
          this.mensajeError = 'No se pudo precargar las participaciones de hoy.';
        }
      });
  }

  guardarParticipaciones(): void {
    this.cargando = true;
    this.mensajeExito = '';
    this.mensajeError = '';

    const llamadas$ = this.estudiantes.map(est => {
      // 1) Obtener id_inscripcion_trimestral
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
            const participoHoy = this.participoPorEstudiante[est.id];

            const payload = {
              participo: participoHoy,
              fecha: this.fechaHoy,
              inscripcion_trimestre: idIns
            };

            // 2) Ver si ya existe un registro con esa fecha e inscripcion_trimestre
            return this.http.get<EstudianteParticipacion[]>(
              `${environment.apiUrl}/estudiantes-participaciones/?` +
              `gestion_academica_trimestral=${this.gestion}&` +
              `curso_id=${this.cursoId}&` +
              `profesor_id=${this.profesorId}&` +
              `materia_id=${this.materiaId}`
            ).pipe(
              switchMap((resArr: EstudianteParticipacion[]) => {
                // Buscar el nodo donde item.estudiante.id === est.id
                // y luego dentro de item.participaciones buscar fecha === fechaHoy
                const itemEst = resArr.find(x => x.estudiante.id === est.id);
                if (itemEst) {
                  const partHoy = itemEst.participaciones.find(p => p.fecha === this.fechaHoy);
                  if (partHoy) {
                    // Existe → hacemos PATCH a /participaciones/{id}/
                    return this.participacionService.actualizarParticipacion(
                      partHoy.id,
                      payload
                    );
                  }
                }
                // No existe → hacemos POST para crear
                return this.participacionService.crearParticipacion(payload);
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
        this.mensajeExito = 'Participaciones de hoy registradas correctamente.';
        this.router.navigate(
          ['/profesor/estudiante-participacion'],
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
        console.error('Error al guardar participaciones:', err);
        this.cargando = false;
        this.mensajeError = 'Ocurrió un error al guardar las participaciones.';
      }
    });
  }
}
