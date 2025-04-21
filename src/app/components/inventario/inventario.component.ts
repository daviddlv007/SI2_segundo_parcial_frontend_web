// src/app/components/inventario/inventario.component.ts

import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { InventarioService } from '../../services/inventario/inventario.service';
import { ProductoService } from '../../services/producto/producto.service';
import { Inventario } from '../../models/inventario/inventario.model';
import { Producto } from '../../models/producto/producto.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FilterService } from '../../services/filter/filter.service';
import { PaginationService } from '../../services/pagination/pagination.service';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.scss'],
})
export class InventarioComponent {
  inventarios: Inventario[] = [];
  inventariosFiltrados: Inventario[] = [];
  inventariosPaginados: Inventario[] = [];
  textoBusqueda: string = '';
  paginaActual = 1;
  elementosPorPagina = 5;
  totalPaginas = 0;

  // Mapa para convertir productoId -> nombre
  private productoMap: Record<number, string> = {};

  mostrarModal = false;
  inventarioAEliminarId: number | null = null;

  constructor(
    private inventarioService: InventarioService,
    private productoService: ProductoService,
    private router: Router,
    private filterService: FilterService,
    private paginationService: PaginationService
  ) {}

  ngOnInit() {
    this.cargarProductosYInventarios();
  }

  private cargarProductosYInventarios(): void {
    this.productoService.obtenerProductos().subscribe((productos: Producto[]) => {
      // creamos mapa id->nombre
      productos.forEach(p => {
        if (p.id != null) this.productoMap[p.id] = p.nombre;
      });
      // luego cargamos los inventarios
      this.obtenerInventarios();
    });
  }

  obtenerInventarios(): void {
    this.inventarioService.obtenerInventarios().subscribe((data: Inventario[]) => {
      // añadimos productoNombre a cada inventario
      this.inventarios = data.map(i => ({
        ...i,
        productoNombre: this.productoMap[i.producto] ?? '–'
      }));
      this.inventariosFiltrados = [...this.inventarios];
      this.calcularPaginacion();
    });
  }

  eliminarInventario(id: number): void {
    this.inventarioService.eliminarInventario(id).subscribe(() => this.obtenerInventarios());
  }

  irACrearInventario(): void {
    this.router.navigate(['/inventario-create']);
  }

  irAEditarInventario(id: number): void {
    this.router.navigate([`/inventario-update/${id}`]);
  }

  confirmarEliminarInventario(id: number): void {
    this.inventarioAEliminarId = id;
    this.mostrarModal = true;
  }

  eliminarInventarioConfirmado(): void {
    if (this.inventarioAEliminarId != null) {
      this.eliminarInventario(this.inventarioAEliminarId);
      this.cerrarModal();
    }
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.inventarioAEliminarId = null;
  }

  filtrarInventarios(): void {
    this.inventariosFiltrados = this.filterService.filtrar(this.inventarios, this.textoBusqueda);
    this.paginaActual = 1;
    this.calcularPaginacion();
  }

  calcularPaginacion(): void {
    const paginacion = this.paginationService.paginate(
      this.inventariosFiltrados,
      this.paginaActual,
      this.elementosPorPagina
    );
    this.totalPaginas = paginacion.totalPages;
    this.inventariosPaginados = paginacion.paginatedData;
  }

  cambiarPagina(direccion: string): void {
    this.paginaActual = this.paginationService.changePage(
      this.paginaActual,
      direccion as 'previous' | 'next',
      this.totalPaginas
    );
    this.actualizarInventariosPaginados();
  }

  actualizarInventariosPaginados(): void {
    const paginacion = this.paginationService.paginate(
      this.inventariosFiltrados,
      this.paginaActual,
      this.elementosPorPagina
    );
    this.inventariosPaginados = paginacion.paginatedData;
  }
}
