import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { VentaService } from '../../services/venta/venta.service';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { FilterService } from '../../services/filter/filter.service';
import { PaginationService } from '../../services/pagination/pagination.service';
import { CarritoDetalleService } from '../../services/carrito-detalle/carrito-detalle.service';
import { ProductoService } from '../../services/producto/producto.service';

import { Venta } from '../../models/venta/venta.model';
import { Usuario } from '../../models/usuario/usuario.model';
import { CarritoDetalle } from '../../models/carrito-detalle/carrito-detalle.model';
import { Producto } from '../../models/producto/producto.model';

@Component({
  selector: 'app-venta',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.scss'],
})
export class VentaComponent {
  ventas: Venta[] = [];
  ventasFiltradas: Venta[] = [];
  ventasPaginadas: Venta[] = [];
  textoBusqueda: string = '';
  paginaActual = 1;
  elementosPorPagina = 5;
  totalPaginas = 0;

  private usuarioMap: Record<number, string> = {};
  private productoMap: Record<number, string> = {};
  private todosDetalles: CarritoDetalle[] = [];

  detallesCarritoActual: CarritoDetalle[] = [];
  mostrarModal = false;
  ventaAEliminarId: number | null = null;
  mostrarModalDetalles = false;

  constructor(
    private ventaService: VentaService,
    private usuarioService: UsuarioService,
    private carritoDetalleService: CarritoDetalleService,
    private productoService: ProductoService,
    private router: Router,
    private filterService: FilterService,
    private paginationService: PaginationService
  ) {}

  ngOnInit() {
    this.cargarDatosIniciales();
  }

  private cargarDatosIniciales(): void {
    forkJoin({
      usuarios: this.usuarioService.obtenerUsuarios(),
      ventas: this.ventaService.obtenerVentas(),
      detalles: this.carritoDetalleService.obtenerTodosDetalles(),
      productos: this.productoService.obtenerProductos()
    }).subscribe(({ usuarios, ventas, detalles, productos }) => {
      usuarios.forEach(u => {
        if (u.id != null) this.usuarioMap[u.id] = u.nombre;
      });

      productos.forEach(p => {
        if (p.id != null) this.productoMap[p.id] = p.nombre;
      });

      this.todosDetalles = detalles.map(d => ({
        ...d,
        productoNombre: this.productoMap[d.producto] ?? '–'
      }));

      this.ventas = ventas.map(v => ({
        ...v,
        usuarioNombre: this.usuarioMap[v.usuario] ?? '–'
      }));

      this.ventasFiltradas = [...this.ventas];
      this.calcularPaginacion();
    });
  }

  verDetallesCarrito(carritoId: number): void {
    this.detallesCarritoActual = this.todosDetalles.filter(d => d.carrito === carritoId);
    this.mostrarModalDetalles = true;
  }

  cerrarModalDetalles(): void {
    this.mostrarModalDetalles = false;
    this.detallesCarritoActual = [];
  }

  confirmarEliminarVenta(id: number): void {
    this.ventaAEliminarId = id;
    this.mostrarModal = true;
  }

  eliminarVentaConfirmado(): void {
    if (this.ventaAEliminarId != null) {
      this.ventaService.eliminarVenta(this.ventaAEliminarId)
        .subscribe(() => this.cargarDatosIniciales());
      this.cerrarModal();
    }
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.ventaAEliminarId = null;
  }

  irACrearVenta(): void {
    this.router.navigate(['/venta-create']);
  }

  irAEditarVenta(id: number): void {
    this.router.navigate([`/venta-update/${id}`]);
  }

  filtrarVentas(): void {
    this.ventasFiltradas = this.filterService.filtrar(this.ventas, this.textoBusqueda);
    this.paginaActual = 1;
    this.calcularPaginacion();
  }

  calcularPaginacion(): void {
    const paginacion = this.paginationService.paginate(
      this.ventasFiltradas,
      this.paginaActual,
      this.elementosPorPagina
    );
    this.totalPaginas = paginacion.totalPages;
    this.ventasPaginadas = paginacion.paginatedData;
  }

  cambiarPagina(direccion: string): void {
    this.paginaActual = this.paginationService.changePage(
      this.paginaActual,
      direccion as 'previous' | 'next',
      this.totalPaginas
    );
    this.calcularPaginacion();
  }

  calcularSubtotal(detalle: CarritoDetalle): number {
    return detalle.cantidad * parseFloat(detalle.precio_unitario);
  }

  calcularTotalDetalles(): number {
    return this.detallesCarritoActual.reduce((total, detalle) => {
      return total + this.calcularSubtotal(detalle);
    }, 0);
  }
}
