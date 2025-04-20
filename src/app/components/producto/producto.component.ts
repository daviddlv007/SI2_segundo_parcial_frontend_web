// src/app/components/producto/producto.component.ts

import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../../services/producto/producto.service';
import { CategoriaService } from '../../services/categoria/categoria.service';
import { Producto } from '../../models/producto/producto.model';
import { Categoria } from '../../models/categoria/categoria.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FilterService } from '../../services/filter/filter.service';
import { PaginationService } from '../../services/pagination/pagination.service';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss'],
})
export class ProductoComponent {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  productosPaginados: Producto[] = [];
  textoBusqueda: string = '';
  paginaActual = 1;
  elementosPorPagina = 5;
  totalPaginas = 0;

  // Mapa para convertir categoriaId -> nombre
  private categoriaMap: Record<number, string> = {};

  mostrarModal = false;
  productoAEliminarId: number | null = null;

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private router: Router,
    private filterService: FilterService,
    private paginationService: PaginationService
  ) {}

  ngOnInit() {
    this.cargarCategoriasYProductos();
  }

  private cargarCategoriasYProductos(): void {
    this.categoriaService.obtenerCategorias().subscribe((categorias: Categoria[]) => {
      // creamos mapa id->nombre
      categorias.forEach(c => {
        if (c.id != null) this.categoriaMap[c.id] = c.nombre;
      });
      // luego cargamos los productos
      this.obtenerProductos();
    });
  }

  obtenerProductos(): void {
    this.productoService.obtenerProductos().subscribe((data: Producto[]) => {
      // añadimos categoriaNombre a cada producto
      this.productos = data.map(p => ({
        ...p,
        categoriaNombre: this.categoriaMap[p.categoria] ?? '–'
      }));
      this.productosFiltrados = [...this.productos];
      this.calcularPaginacion();
    });
  }

  eliminarProducto(id: number): void {
    this.productoService.eliminarProducto(id).subscribe(() => this.obtenerProductos());
  }

  irACrearProducto(): void {
    this.router.navigate(['/producto-create']);
  }

  irAEditarProducto(id: number): void {
    this.router.navigate([`/producto-update/${id}`]);
  }

  confirmarEliminarProducto(id: number): void {
    this.productoAEliminarId = id;
    this.mostrarModal = true;
  }

  eliminarProductoConfirmado(): void {
    if (this.productoAEliminarId != null) {
      this.eliminarProducto(this.productoAEliminarId);
      this.cerrarModal();
    }
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.productoAEliminarId = null;
  }

  filtrarProductos(): void {
    this.productosFiltrados = this.filterService.filtrar(this.productos, this.textoBusqueda);
    this.paginaActual = 1;
    this.calcularPaginacion();
  }

  calcularPaginacion(): void {
    const paginacion = this.paginationService.paginate(
      this.productosFiltrados,
      this.paginaActual,
      this.elementosPorPagina
    );
    this.totalPaginas = paginacion.totalPages;
    this.productosPaginados = paginacion.paginatedData;
  }

  cambiarPagina(direccion: string): void {
    this.paginaActual = this.paginationService.changePage(
      this.paginaActual,
      direccion as 'previous' | 'next',
      this.totalPaginas
    );
    this.actualizarProductosPaginados();
  }

  actualizarProductosPaginados(): void {
    const paginacion = this.paginationService.paginate(
      this.productosFiltrados,
      this.paginaActual,
      this.elementosPorPagina
    );
    this.productosPaginados = paginacion.paginatedData;
  }
}
