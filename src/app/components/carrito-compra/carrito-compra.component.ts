// src/app/components/carrito-compra/carrito-compra.component.ts

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
  textoBusqueda = '';
  paginaActual = 1;
  elementosPorPagina = 5;
  totalPaginas = 0;

  mostrarModalEliminar = false;
  carritoAEliminarId: number | null = null;

  mostrarModalDetalles = false;

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
    forkJoin({
      usuarios: this.usuarioService.obtenerUsuarios(),
      carritos: this.carritoService.obtenerCarritosCompra()
    }).subscribe(({ usuarios, carritos }) => {
      // Primero llenamos el mapa de usuarios
      usuarios.forEach(u => {
        if (u.id != null) this.usuarioMap[u.id] = u.nombre;
      });

      // Luego procesamos los carritos con los nombres de usuario
      this.carritos = carritos.map(c => ({
        ...c,
        usuarioNombre: this.usuarioMap[c.usuario] ?? 'Usuario no encontrado'
      }));
      
      this.carritosFiltrados = [...this.carritos];
      this.calcularPaginacion();
    });
  }

  verDetallesPorCarrito(id: number): void {
    this.carritoDetalleService.obtenerDetallesPorCarrito(id).subscribe(data => {
      this.carritoDetalles = data;
      this.mostrarModalDetalles = true;
    });
  }

  // ... (el resto de los métodos permanecen igual)
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
      this.carritoService.eliminarCarritoCompra(this.carritoAEliminarId)
        .subscribe(() => {
          this.cargarDatosIniciales(); // Recargamos todos los datos
          this.cerrarModalEliminar();
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
}