// src/app/components/registrar-asistencia-estudiante/registrar-asistencia-estudiante.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // ← Importar Router
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, switchMap } from 'rxjs';

import { EstudianteClaseService } from '../../services/estudiante-clase/estudiante-clase.service';
import { InscripcionTrimestralService } from '../../services/inscripcion-trimestral/inscripcion-trimestral.service';
import { AsistenciaService } from '../../services/asistencia/asistencia.service';
import { Estudiante } from '../../models/estudiante-clase/estudiante-clase.model';

@Component({
  selector: 'app-registrar-asistencia-estudiante',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registrar-asistencia-estudiante.component.html',
  styleUrls: ['./registrar-asistencia-estudiante.component.scss']
})
export class RegistrarAsistenciaEstudianteComponent implements OnInit {
  gestion = '';
  cursoId = 0;
  profesorId = 0;
  materiaId = 0;

  estudiantes: Estudiante[] = [];
  asistenciaSeleccionada: { [estudianteId: number]: string } = {};

  cargando = false;
  mensajeExito = '';
  mensajeError = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,                             // ← Inyectar Router
    private estudianteService: EstudianteClaseService,
    private inscripcionService: InscripcionTrimestralService,
    private asistenciaService: AsistenciaService
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
    this.estudianteService
      .getEstudiantes({
        gestion_academica_trimestral: this.gestion,
        curso_id: this.cursoId,
        profesor_id: this.profesorId,
        materia_id: this.materiaId
      })
      .subscribe({
        next: lista => {
          this.estudiantes = lista;
          this.estudiantes.forEach(e => {
            this.asistenciaSeleccionada[e.id] = 'P';
          });
        },
        error: err => {
          console.error('Error al cargar estudiantes:', err);
          this.mensajeError = 'No se pudo obtener la lista de estudiantes.';
        }
      });
  }

  private fechaHoyIso(): string {
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd = String(hoy.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  guardarTodasAsistencias(): void {
    this.cargando = true;
    this.mensajeExito = '';
    this.mensajeError = '';

    const fechaISO = this.fechaHoyIso();

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
            const tipo = this.asistenciaSeleccionada[est.id];
            return this.asistenciaService.crearAsistencia({
              fecha: fechaISO,
              tipo,
              observaciones: '',
              inscripcion_trimestre: idIns
            });
          })
        );
    });

    forkJoin(llamadas$).subscribe({
      next: _ => {
        this.cargando = false;
        this.mensajeExito = 'Asistencias guardadas correctamente.';

        // ← Aquí, redirigir a la vista de lectura con los mismos queryParams:
        this.router.navigate(
          ['/profesor/estudiante-asistencia'],
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
        console.error('Error al guardar asistencias:', err);
        this.cargando = false;
        this.mensajeError = 'Ocurrió un error al guardar las asistencias.';
      }
    });
  }
}
