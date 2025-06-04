// src/app/components/inscripcion/inscripcion.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { InscripcionService } from '../../services/inscripcion/inscripcion.service';
import { CursoService } from '../../services/curso/curso.service';
import { MateriaService } from '../../services/materia/materia.service';
import { ProfesorService } from '../../services/profesor/profesor.service';
import { EstudianteService } from '../../services/estudiante/estudiante.service';
import { UsuarioService } from '../../services/usuario/usuario.service';

import { Inscripcion } from '../../models/inscripcion/inscripcion.model';

@Component({
  selector: 'app-inscripcion',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './inscripcion.component.html',
  styleUrls: ['./inscripcion.component.scss'],
})
export class InscripcionComponent {
  inscripciones: Inscripcion[] = [];
  paginaActual: number = 1;
  elementosPorPagina: number = 10;
  totalInscripciones: number = 0;
  mostrarModal: boolean = false;
  inscripcionAEliminarId: number | null = null;

  constructor(
    private inscripcionService: InscripcionService,
    private cursoService: CursoService,
    private materiaService: MateriaService,
    private profesorService: ProfesorService,
    private estudianteService: EstudianteService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit() {
    this.obtenerInscripciones();
  }

  obtenerInscripciones(): void {
    this.inscripcionService
      .obtenerInscripciones({
        page: this.paginaActual,
        page_size: this.elementosPorPagina,
      })
      .subscribe((response) => {
        this.inscripciones = response.results;
        this.totalInscripciones = response.count;

        // Para cada inscripción, cargar:
        // 1) Curso → nombre + paralelo
        // 2) Materia → nombre
        // 3) Profesor → usuario → nombre
        // 4) Estudiante → usuario → nombre

        this.inscripciones.forEach((ins) => {
          // 1) Curso
          this.cursoService.obtenerCursoPorId(ins.curso).subscribe(
            (curso) => {
              ins.cursoNombre = `${curso.nombre} ${curso.paralelo}`;
            },
            (errCurso) => {
              console.error(`Error al obtener curso ID ${ins.curso}:`, errCurso);
              ins.cursoNombre = '—';
            }
          );

          // 2) Materia
          this.materiaService.obtenerMateriaPorId(ins.materia).subscribe(
            (materia) => {
              ins.materiaNombre = materia.nombre;
            },
            (errMat) => {
              console.error(`Error al obtener materia ID ${ins.materia}:`, errMat);
              ins.materiaNombre = '—';
            }
          );

          // 3) Profesor → usuario → nombre
          if (ins.profesor !== null) {
            this.profesorService.obtenerProfesorPorId(ins.profesor).subscribe(
              (profesor) => {
                this.usuarioService.obtenerUsuarioPorId(profesor.usuario).subscribe(
                  (usuario) => {
                    ins.profesorNombre = usuario.nombre;
                  },
                  (errUsuProf) => {
                    console.error(
                      `Error al obtener usuario del profesor ID ${profesor.usuario}:`,
                      errUsuProf
                    );
                    ins.profesorNombre = '—';
                  }
                );
              },
              (errProf) => {
                console.error(`Error al obtener profesor ID ${ins.profesor}:`, errProf);
                ins.profesorNombre = '—';
              }
            );
          } else {
            ins.profesorNombre = 'Sin asignar';
          }

          // 4) Estudiante → usuario → nombre
          this.estudianteService.obtenerEstudiantePorId(ins.estudiante).subscribe(
            (estudiante) => {
              this.usuarioService.obtenerUsuarioPorId(estudiante.usuario).subscribe(
                (usuarioEst) => {
                  ins.estudianteNombre = usuarioEst.nombre;
                },
                (errUsuEst) => {
                  console.error(
                    `Error al obtener usuario del estudiante ID ${estudiante.usuario}:`,
                    errUsuEst
                  );
                  ins.estudianteNombre = '—';
                }
              );
            },
            (errEst) => {
              console.error(`Error al obtener estudiante ID ${ins.estudiante}:`, errEst);
              ins.estudianteNombre = '—';
            }
          );
        });
      });
  }

  get totalPaginas(): number {
    return Math.ceil(this.totalInscripciones / this.elementosPorPagina) || 1;
  }

  irACrearInscripcion(): void {
    this.router.navigate(['/inscripcion-create']);
  }

  irAEditarInscripcion(id: number): void {
    this.router.navigate([`/inscripcion-update/${id}`]);
  }

  confirmarEliminarInscripcion(id: number): void {
    this.inscripcionAEliminarId = id;
    this.mostrarModal = true;
  }

  eliminarInscripcionConfirmado(): void {
    if (this.inscripcionAEliminarId !== null) {
      this.inscripcionService
        .eliminarInscripcion(this.inscripcionAEliminarId)
        .subscribe(() => this.obtenerInscripciones());
      this.cerrarModal();
    }
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.inscripcionAEliminarId = null;
  }

  cambiarPagina(direccion: 'previous' | 'next'): void {
    if (direccion === 'previous' && this.paginaActual > 1) {
      this.paginaActual--;
    } else if (
      direccion === 'next' &&
      this.paginaActual < this.totalPaginas
    ) {
      this.paginaActual++;
    }
    this.obtenerInscripciones();
  }
}
