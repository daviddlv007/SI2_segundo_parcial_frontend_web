// src/app/components/inscripcion-trimestre/inscripcion-trimestre.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { InscripcionTrimestreService } from '../../services/inscripcion-trimestre/inscripcion-trimestre.service';
import { InscripcionService } from '../../services/inscripcion/inscripcion.service';
import { CursoService } from '../../services/curso/curso.service';
import { MateriaService } from '../../services/materia/materia.service';
import { ProfesorService } from '../../services/profesor/profesor.service';
import { EstudianteService } from '../../services/estudiante/estudiante.service';
import { UsuarioService } from '../../services/usuario/usuario.service';

import { InscripcionTrimestre } from '../../models/inscripcion-trimestre/inscripcion-trimestre.model';
import { Inscripcion } from '../../models/inscripcion/inscripcion.model';

@Component({
  selector: 'app-inscripcion-trimestre',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './inscripcion-trimestre.component.html',
  styleUrls: ['./inscripcion-trimestre.component.scss'],
})
export class InscripcionTrimestreComponent {
  inscripcionesTrimestrales: InscripcionTrimestre[] = [];
  paginaActual: number = 1;
  elementosPorPagina: number = 10;
  totalItems: number = 0;
  mostrarModal: boolean = false;
  idAEliminar: number | null = null;

  constructor(
    private insTriService: InscripcionTrimestreService,
    private insService: InscripcionService,
    private cursoService: CursoService,
    private materiaService: MateriaService,
    private profesorService: ProfesorService,
    private estudianteService: EstudianteService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit() {
    this.obtenerInscripcionesTrimestrales();
  }

  obtenerInscripcionesTrimestrales(): void {
    this.insTriService
      .obtenerInscripcionesTrimestrales({
        page: this.paginaActual,
        page_size: this.elementosPorPagina,
      })
      .subscribe((response) => {
        this.inscripcionesTrimestrales = response.results;
        this.totalItems = response.count;

        // Por cada registro de InscripcionTrimestral, obtener datos de la Inscripcion padre
        this.inscripcionesTrimestrales.forEach((item) => {
          this.insService.obtenerInscripcionPorId(item.inscripcion).subscribe(
            (inscripcion: Inscripcion) => {
              // 1) Curso → nombre + paralelo
              this.cursoService.obtenerCursoPorId(inscripcion.curso).subscribe(
                (curso) => {
                  item.cursoNombre = `${curso.nombre} ${curso.paralelo}`;
                },
                (errCurso) => {
                  console.error(`Error al obtener curso ID ${inscripcion.curso}:`, errCurso);
                  item.cursoNombre = '—';
                }
              );

              // 2) Materia → nombre
              this.materiaService.obtenerMateriaPorId(inscripcion.materia).subscribe(
                (materia) => {
                  item.materiaNombre = materia.nombre;
                },
                (errMat) => {
                  console.error(`Error al obtener materia ID ${inscripcion.materia}:`, errMat);
                  item.materiaNombre = '—';
                }
              );

              // 3) Profesor → usuario → nombre
              if (inscripcion.profesor !== null) {
                this.profesorService.obtenerProfesorPorId(inscripcion.profesor).subscribe(
                  (profesorObj) => {
                    this.usuarioService.obtenerUsuarioPorId(profesorObj.usuario).subscribe(
                      (usuarioProf) => {
                        item.profesorNombre = usuarioProf.nombre;
                      },
                      (errUsuProf) => {
                        console.error(
                          `Error al obtener usuario del profesor ID ${profesorObj.usuario}:`,
                          errUsuProf
                        );
                        item.profesorNombre = '—';
                      }
                    );
                  },
                  (errProf) => {
                    console.error(`Error al obtener profesor ID ${inscripcion.profesor}:`, errProf);
                    item.profesorNombre = '—';
                  }
                );
              } else {
                item.profesorNombre = 'Sin asignar';
              }

              // 4) Estudiante → usuario → nombre
              this.estudianteService.obtenerEstudiantePorId(inscripcion.estudiante).subscribe(
                (estudianteObj) => {
                  this.usuarioService.obtenerUsuarioPorId(estudianteObj.usuario).subscribe(
                    (usuarioEst) => {
                      item.estudianteNombre = usuarioEst.nombre;
                    },
                    (errUsuEst) => {
                      console.error(
                        `Error al obtener usuario del estudiante ID ${estudianteObj.usuario}:`,
                        errUsuEst
                      );
                      item.estudianteNombre = '—';
                    }
                  );
                },
                (errEst) => {
                  console.error(`Error al obtener estudiante ID ${inscripcion.estudiante}:`, errEst);
                  item.estudianteNombre = '—';
                }
              );
            },
            (errIns) => {
              console.error(`Error al obtener inscripción ID ${item.inscripcion}:`, errIns);
              // Si no se pudo cargar la Inscripcion, se asignan valores por defecto
              item.cursoNombre = '—';
              item.materiaNombre = '—';
              item.profesorNombre = '—';
              item.estudianteNombre = '—';
            }
          );
        });
      });
  }

  get totalPaginas(): number {
    return Math.ceil(this.totalItems / this.elementosPorPagina) || 1;
  }

  irACrearInscripcionTrimestral(): void {
    this.router.navigate(['/inscripcion-trimestre-create']);
  }

  irAEditarInscripcionTrimestral(id: number): void {
    this.router.navigate([`/inscripcion-trimestre-update/${id}`]);
  }

  confirmarEliminar(id: number): void {
    this.idAEliminar = id;
    this.mostrarModal = true;
  }

  eliminarConfirmado(): void {
    if (this.idAEliminar !== null) {
      this.insTriService.eliminarInscripcionTrimestral(this.idAEliminar)
        .subscribe(() => this.obtenerInscripcionesTrimestrales());
      this.cerrarModal();
    }
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.idAEliminar = null;
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
    this.obtenerInscripcionesTrimestrales();
  }
}
