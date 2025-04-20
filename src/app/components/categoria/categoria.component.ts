import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CategoriaService } from '../../services/categoria/categoria.service';
import { Categoria } from '../../models/categoria/categoria.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FilterService } from '../../services/filter/filter.service';
import { PaginationService } from '../../services/pagination/pagination.service';

@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.scss'],
})
export class CategoriaComponent {
  categorias: Categoria[] = [];
  categoriasFiltradas: Categoria[] = [];
  categoriasPaginadas: Categoria[] = [];
  textoBusqueda: string = '';
  paginaActual: number = 1;
  elementosPorPagina: number = 10;
  totalPaginas: number = 0;
  mostrarModal: boolean = false;  // Control del modal
  categoriaAEliminarId: number | null = null;  // ID de la categoria a eliminar

  constructor(
    private categoriaService: CategoriaService,
    private router: Router,
    private filterService: FilterService,
    private paginationService: PaginationService
  ) {}

  ngOnInit() {
    this.obtenerCategorias();
  }

  obtenerCategorias(): void {
    this.categoriaService.obtenerCategorias().subscribe((data) => {
      this.categorias = data;
      this.categoriasFiltradas = data;
      this.calcularPaginacion();
    });
  }

  eliminarCategoria(id: number): void {
    this.categoriaService.eliminarCategoria(id).subscribe(() => {
      this.obtenerCategorias();
    });
  }

  irACrearCategoria(): void {
    this.router.navigate(['/categoria-create']);
  }

  irAEditarCategoria(id: number): void {
    this.router.navigate([`/categoria-update/${id}`]);
  }

  confirmarEliminarCategoria(id: number): void {
    this.categoriaAEliminarId = id;  // Guardamos el id de la categoria a eliminar
    this.mostrarModal = true;  // Mostramos el modal
  }

  eliminarCategoriaConfirmada(): void {
    if (this.categoriaAEliminarId !== null) {
      this.eliminarCategoria(this.categoriaAEliminarId);  // Realizamos la eliminación
      this.cerrarModal();  // Cerramos el modal
    }
  }

  cerrarModal(): void {
    this.mostrarModal = false;  // Ocultamos el modal
    this.categoriaAEliminarId = null;  // Limpiamos el id de la categoria a eliminar
  }

  filtrarCategorias(): void {
    this.categoriasFiltradas = this.filterService.filtrar(this.categorias, this.textoBusqueda);
    this.paginaActual = 1;  // Resetear la página actual al buscar
    this.calcularPaginacion();
  }

  calcularPaginacion(): void {
    const paginacion = this.paginationService.paginate(
      this.categoriasFiltradas,
      this.paginaActual,
      this.elementosPorPagina
    );
    this.totalPaginas = paginacion.totalPages;
    this.categoriasPaginadas = paginacion.paginatedData;
  }

  cambiarPagina(direccion: string): void {
    this.paginaActual = this.paginationService.changePage(
      this.paginaActual,
      direccion as 'previous' | 'next',
      this.totalPaginas
    );
    this.actualizarCategoriasPaginadas();
  }

  actualizarCategoriasPaginadas(): void {
    const paginacion = this.paginationService.paginate(
      this.categoriasFiltradas,
      this.paginaActual,
      this.elementosPorPagina
    );
    this.categoriasPaginadas = paginacion.paginatedData;
  }
}
