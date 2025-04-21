import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { CarritoCompraService } from '../../services/carrito-compra/carrito-compra.service';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { CarritoDetalleService } from '../../services/carrito-detalle/carrito-detalle.service';

import { CarritoCompra } from '../../models/carrito-compra/carrito-compra.model';
import { Usuario } from '../../models/usuario/usuario.model';
import { CarritoDetalle } from '../../models/carrito-detalle/carrito-detalle.model';

import { FilterService } from '../../services/filter/filter.service';
import { PaginationService } from '../../services/pagination/pagination.service';

@Component({
  selector: 'app-carrito-compra',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './carrito-compra.component.html',
  styleUrls: ['./carrito-compra.component.scss'],
})
export class CarritoCompraComponent implements OnInit {
  carritos: CarritoCompra[] = [];
  carritosFiltrados: CarritoCompra[] = [];
  carritosPaginados: CarritoCompra[] = [];
  carritoDetalles: CarritoDetalle[] = [];
  todosDetalles: CarritoDetalle[] = [];
  textoBusqueda = '';
  paginaActual = 1;
  elementosPorPagina = 5;
  totalPaginas = 0;

  mostrarModalEliminar = false;
  carritoAEliminarId: number | null = null;
  mostrarModalDetalles = false;
  cargando = true;

  // mapa id->nombre
  private usuarioMap: Record<number, string> = {};

  constructor(
    private carritoService: CarritoCompraService,
    private usuarioService: UsuarioService,
    private carritoDetalleService: CarritoDetalleService,
    private router: Router,
    private filterService: FilterService,
    private paginationService: PaginationService
  ) {}

  ngOnInit() {
    this.cargarDatosIniciales();
  }

  private cargarDatosIniciales(): void {
    this.cargando = true;
    
    forkJoin({
      usuarios: this.usuarioService.obtenerUsuarios(),
      carritos: this.carritoService.obtenerTodosCarritos(),
      detalles: this.carritoDetalleService.obtenerTodosDetalles()
    }).subscribe({
      next: ({ usuarios, carritos, detalles }) => {
        // Llenar mapa de usuarios
        usuarios.forEach(u => {
          if (u.id != null) this.usuarioMap[u.id] = u.nombre;
        });

        // Guardar todos los detalles para filtrado
        this.todosDetalles = detalles;

        // Procesar carritos con nombres de usuario
        this.carritos = carritos.map(c => ({
          ...c,
          usuarioNombre: this.usuarioMap[c.usuario] ?? 'Usuario no encontrado'
        }));
        
        this.carritosFiltrados = [...this.carritos];
        this.calcularPaginacion();
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar datos:', err);
        this.cargando = false;
      }
    });
  }

  verDetallesPorCarrito(id: number): void {
    // Filtrado en frontend con los detalles ya cargados
    this.carritoDetalles = this.todosDetalles.filter(d => d.carrito === id);
    this.mostrarModalDetalles = true;
  }

  cerrarModalDetalles(): void {
    this.mostrarModalDetalles = false;
    this.carritoDetalles = [];
  }

  confirmarEliminarCarrito(id: number): void {
    this.carritoAEliminarId = id;
    this.mostrarModalEliminar = true;
  }

  eliminarCarritoConfirmado(): void {
    if (this.carritoAEliminarId != null) {
      this.carritoService.eliminarCarrito(this.carritoAEliminarId)
        .subscribe({
          next: () => {
            this.cargarDatosIniciales();
            this.cerrarModalEliminar();
          },
          error: (err) => {
            console.error('Error al eliminar carrito:', err);
          }
        });
    }
  }

  cerrarModalEliminar(): void {
    this.mostrarModalEliminar = false;
    this.carritoAEliminarId = null;
  }

  irACrearCarrito(): void {
    this.router.navigate(['/carrito-create']);
  }

  irAEditarCarrito(id: number): void {
    this.router.navigate([`/carrito-update/${id}`]);
  }

  filtrarCarritos(): void {
    this.carritosFiltrados = this.filterService.filtrar(this.carritos, this.textoBusqueda);
    this.paginaActual = 1;
    this.calcularPaginacion();
  }

  calcularPaginacion(): void {
    const pag = this.paginationService.paginate(
      this.carritosFiltrados, this.paginaActual, this.elementosPorPagina
    );
    this.totalPaginas = pag.totalPages;
    this.carritosPaginados = pag.paginatedData;
  }

  cambiarPagina(dir: string): void {
    this.paginaActual = this.paginationService.changePage(
      this.paginaActual, dir as 'previous'|'next', this.totalPaginas
    );
    this.calcularPaginacion();
  }


calcularSubtotal(detalle: CarritoDetalle): number {
    return detalle.cantidad * parseFloat(detalle.precio_unitario);
  }

calcularTotal(): number {
  return this.carritoDetalles.reduce((total, detalle) => {
    return total + this.calcularSubtotal(detalle);
  }, 0);
}
}