import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { CursoService } from '../../services/curso/curso.service';
import { Curso } from '../../models/curso/curso.model';

@Component({
  selector: 'app-curso',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './curso.component.html',
  styleUrls: ['./curso.component.scss'],
})
export class CursoComponent {
  cursos: Curso[] = [];
  paginaActual: number = 1;
  elementosPorPagina: number = 10;
  totalCursos: number = 0;
  mostrarModal: boolean = false;
  cursoAEliminarId: number | null = null;

  constructor(
    private cursoService: CursoService,
    private router: Router
  ) {}

  ngOnInit() {
    this.obtenerCursos();
  }

  obtenerCursos(): void {
    this.cursoService.obtenerCursos({
      page: this.paginaActual,
      page_size: this.elementosPorPagina
    }).subscribe(response => {
      this.cursos = response.results;
      this.totalCursos = response.count;
    });
  }

  get totalPaginas(): number {
    return Math.ceil(this.totalCursos / this.elementosPorPagina) || 1;
  }

  irACrearCurso(): void {
    this.router.navigate(['/curso-create']);
  }

  irAEditarCurso(id: number): void {
    this.router.navigate([`/curso-update/${id}`]);
  }

  confirmarEliminarCurso(id: number): void {
    this.cursoAEliminarId = id;
    this.mostrarModal = true;
  }

  eliminarCursoConfirmado(): void {
    if (this.cursoAEliminarId !== null) {
      this.cursoService.eliminarCurso(this.cursoAEliminarId)
        .subscribe(() => this.obtenerCursos());
      this.cerrarModal();
    }
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.cursoAEliminarId = null;
  }

  cambiarPagina(direccion: 'previous' | 'next'): void {
    if (direccion === 'previous' && this.paginaActual > 1) {
      this.paginaActual--;
    } else if (direccion === 'next' && this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
    }
    this.obtenerCursos();
  }
}
