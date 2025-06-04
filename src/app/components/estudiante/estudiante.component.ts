// src/app/components/estudiante/estudiante.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { EstudianteService } from '../../services/estudiante/estudiante.service';
import { Estudiante } from '../../models/estudiante/estudiante.model';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { CursoService } from '../../services/curso/curso.service';

@Component({
  selector: 'app-estudiante',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './estudiante.component.html',
  styleUrls: ['./estudiante.component.scss'],
})
export class EstudianteComponent {
  estudiantes: Estudiante[] = [];
  paginaActual: number = 1;
  elementosPorPagina: number = 10;
  totalEstudiantes: number = 0;
  mostrarModal: boolean = false;
  estudianteAEliminarId: number | null = null;

  constructor(
    private estudianteService: EstudianteService,
    private usuarioService: UsuarioService,
    private cursoService: CursoService,
    private router: Router
  ) {}

  ngOnInit() {
    this.obtenerEstudiantes();
  }

  obtenerEstudiantes(): void {
    this.estudianteService
      .obtenerEstudiantes({
        page: this.paginaActual,
        page_size: this.elementosPorPagina,
      })
      .subscribe((response) => {
        this.estudiantes = response.results;
        this.totalEstudiantes = response.count;

        // Para cada estudiante, obtener el nombre del usuario y del curso
        this.estudiantes.forEach((est) => {
          // 1) Obtener nombre de usuario
          this.usuarioService.obtenerUsuarioPorId(est.usuario).subscribe(
            (usuario) => {
              est.usuarioNombre = usuario.nombre;
            },
            (error) => {
              console.error(
                `Error al obtener usuario con ID ${est.usuario}:`,
                error
              );
              est.usuarioNombre = '—';
            }
          );

          // 2) (Opcional) Obtener nombre de curso si se desea mostrar
          if (est.curso) {
            this.cursoService.obtenerCursoPorId(est.curso).subscribe(
              (curso) => {
                est.cursoNombre = curso.nombre + ' ' + curso.paralelo;
              },
              (error) => {
                console.error(
                  `Error al obtener curso con ID ${est.curso}:`,
                  error
                );
                est.cursoNombre = '—';
              }
            );
          } else {
            est.cursoNombre = 'Sin asignar';
          }
        });
      });
  }

  get totalPaginas(): number {
    return Math.ceil(this.totalEstudiantes / this.elementosPorPagina) || 1;
  }

  irACrearEstudiante(): void {
    this.router.navigate(['admin/estudiante-create']);
  }

  irAEditarEstudiante(id: number): void {
    this.router.navigate([`admin/estudiante-update/${id}`]);
  }

  confirmarEliminarEstudiante(id: number): void {
    this.estudianteAEliminarId = id;
    this.mostrarModal = true;
  }

  eliminarEstudianteConfirmado(): void {
    if (this.estudianteAEliminarId !== null) {
      this.estudianteService
        .eliminarEstudiante(this.estudianteAEliminarId)
        .subscribe(() => this.obtenerEstudiantes());
      this.cerrarModal();
    }
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.estudianteAEliminarId = null;
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
    this.obtenerEstudiantes();
  }
}
