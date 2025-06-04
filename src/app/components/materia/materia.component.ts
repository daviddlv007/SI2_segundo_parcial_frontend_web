import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MateriaService } from '../../services/materia/materia.service';
import { Materia } from '../../models/materia/materia.model';

@Component({
  selector: 'app-materia',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './materia.component.html',
  styleUrls: ['./materia.component.scss'],
})
export class MateriaComponent {
  materias: Materia[] = [];
  paginaActual: number = 1;
  elementosPorPagina: number = 10;
  totalMaterias: number = 0;
  mostrarModal: boolean = false;
  materiaAEliminarId: number | null = null;

  constructor(
    private materiaService: MateriaService,
    private router: Router
  ) {}

  ngOnInit() {
    this.obtenerMaterias();
  }

  obtenerMaterias(): void {
    this.materiaService.obtenerMaterias({
      page: this.paginaActual,
      page_size: this.elementosPorPagina
    }).subscribe(response => {
      this.materias = response.results;
      this.totalMaterias = response.count;
    });
  }

  get totalPaginas(): number {
    return Math.ceil(this.totalMaterias / this.elementosPorPagina) || 1;
  }

  irACrearMateria(): void {
    this.router.navigate(['/admin/materia-create']);
  }

  irAEditarMateria(id: number): void {
    this.router.navigate([`/admin/materia-update/${id}`]);
  }

  confirmarEliminarMateria(id: number): void {
    this.materiaAEliminarId = id;
    this.mostrarModal = true;
  }

  eliminarMateriaConfirmada(): void {
    if (this.materiaAEliminarId !== null) {
      this.materiaService.eliminarMateria(this.materiaAEliminarId)
        .subscribe(() => this.obtenerMaterias());
      this.cerrarModal();
    }
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.materiaAEliminarId = null;
  }

  cambiarPagina(direccion: 'previous' | 'next'): void {
    if (direccion === 'previous' && this.paginaActual > 1) {
      this.paginaActual--;
    } else if (direccion === 'next' && this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
    }
    this.obtenerMaterias();
  }
}
