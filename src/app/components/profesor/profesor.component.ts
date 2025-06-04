// src/app/components/profesor/profesor.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ProfesorService } from '../../services/profesor/profesor.service';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { Profesor } from '../../models/profesor/profesor.model';

@Component({
  selector: 'app-profesor',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './profesor.component.html',
  styleUrls: ['./profesor.component.scss'],
})
export class ProfesorComponent {
  profesores: Profesor[] = [];
  paginaActual: number = 1;
  elementosPorPagina: number = 10;
  totalProfesores: number = 0;
  mostrarModal: boolean = false;
  profesorAEliminarId: number | null = null;

  constructor(
    private profesorService: ProfesorService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit() {
    this.obtenerProfesores();
  }

  obtenerProfesores(): void {
    this.profesorService
      .obtenerProfesores({
        page: this.paginaActual,
        page_size: this.elementosPorPagina,
      })
      .subscribe((response) => {
        this.profesores = response.results;
        this.totalProfesores = response.count;

        // Para cada profesor, obtener el nombre del usuario
        this.profesores.forEach((prof) => {
          this.usuarioService.obtenerUsuarioPorId(prof.usuario).subscribe(
            (usuario) => {
              prof.usuarioNombre = usuario.nombre;
            },
            (error) => {
              console.error(
                `Error al obtener usuario con ID ${prof.usuario}:`,
                error
              );
              prof.usuarioNombre = '—';
            }
          );
        });
      });
  }

  get totalPaginas(): number {
    return Math.ceil(this.totalProfesores / this.elementosPorPagina) || 1;
  }

  irACrearProfesor(): void {
    this.router.navigate(['/admin/profesor-create']);
  }

  irAEditarProfesor(id: number): void {
    this.router.navigate([`/admin/profesor-update/${id}`]);
  }

  confirmarEliminarProfesor(id: number): void {
    this.profesorAEliminarId = id;
    this.mostrarModal = true;
  }

  eliminarProfesorConfirmado(): void {
    if (this.profesorAEliminarId !== null) {
      this.profesorService
        .eliminarProfesor(this.profesorAEliminarId)
        .subscribe(() => this.obtenerProfesores());
      this.cerrarModal();
    }
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.profesorAEliminarId = null;
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
    this.obtenerProfesores();
  }
}
