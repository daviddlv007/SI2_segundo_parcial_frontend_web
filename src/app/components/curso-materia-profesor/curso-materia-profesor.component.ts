// src/app/components/curso-materia-profesor/curso-materia-profesor.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { CursoMateriaProfesorService } from '../../services/curso-materia-profesor/curso-materia-profesor.service';
import { CursoService } from '../../services/curso/curso.service';
import { MateriaService } from '../../services/materia/materia.service';
import { ProfesorService } from '../../services/profesor/profesor.service';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { CursoMateriaProfesor } from '../../models/curso-materia-profesor/curso-materia-profesor.model';

@Component({
  selector: 'app-curso-materia-profesor',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './curso-materia-profesor.component.html',
  styleUrls: ['./curso-materia-profesor.component.scss'],
})
export class CursoMateriaProfesorComponent {
  asignaciones: CursoMateriaProfesor[] = [];
  paginaActual: number = 1;
  elementosPorPagina: number = 10;
  totalAsignaciones: number = 0;
  mostrarModal: boolean = false;
  asignacionAEliminarId: number | null = null;

  constructor(
    private cmpService: CursoMateriaProfesorService,
    private cursoService: CursoService,
    private materiaService: MateriaService,
    private profesorService: ProfesorService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit() {
    this.obtenerAsignaciones();
  }

  obtenerAsignaciones(): void {
    this.cmpService
      .obtenerAsignaciones({
        page: this.paginaActual,
        page_size: this.elementosPorPagina,
      })
      .subscribe((response) => {
        this.asignaciones = response.results;
        this.totalAsignaciones = response.count;

        // Para cada asignación, cargar nombre de curso, materia y nombre de usuario del profesor
        this.asignaciones.forEach((asig) => {
          // 1) Curso → nombre + paralelo
          this.cursoService.obtenerCursoPorId(asig.curso).subscribe(
            (curso) => {
              asig.cursoNombre = `${curso.nombre} ${curso.paralelo}`;
            },
            (error) => {
              console.error(`Error al obtener curso ID ${asig.curso}:`, error);
              asig.cursoNombre = '—';
            }
          );

          // 2) Materia → nombre
          this.materiaService.obtenerMateriaPorId(asig.materia).subscribe(
            (materia) => {
              asig.materiaNombre = materia.nombre;
            },
            (error) => {
              console.error(`Error al obtener materia ID ${asig.materia}:`, error);
              asig.materiaNombre = '—';
            }
          );

          // 3) Profesor → usuario → nombre
          this.profesorService.obtenerProfesorPorId(asig.profesor).subscribe(
            (profesor) => {
              // profesor.usuario es el ID de Usuario
              this.usuarioService.obtenerUsuarioPorId(profesor.usuario).subscribe(
                (usuario) => {
                  asig.profesorNombre = usuario.nombre;
                },
                (errUsu) => {
                  console.error(`Error al obtener usuario ID ${profesor.usuario}:`, errUsu);
                  asig.profesorNombre = '—';
                }
              );
            },
            (errProf) => {
              console.error(`Error al obtener profesor ID ${asig.profesor}:`, errProf);
              asig.profesorNombre = '—';
            }
          );
        });
      });
  }

  get totalPaginas(): number {
    return Math.ceil(this.totalAsignaciones / this.elementosPorPagina) || 1;
  }

  irACrearAsignacion(): void {
    this.router.navigate(['/asignacion-create']);
  }

  irAEditarAsignacion(id: number): void {
    this.router.navigate([`/asignacion-update/${id}`]);
  }

  confirmarEliminarAsignacion(id: number): void {
    this.asignacionAEliminarId = id;
    this.mostrarModal = true;
  }

  eliminarAsignacionConfirmado(): void {
    if (this.asignacionAEliminarId !== null) {
      this.cmpService.eliminarAsignacion(this.asignacionAEliminarId)
        .subscribe(() => this.obtenerAsignaciones());
      this.cerrarModal();
    }
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.asignacionAEliminarId = null;
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
    this.obtenerAsignaciones();
  }
}
