// src/app/components/venta/venta-create/venta-create.component.ts 

import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { VentaService } from '../../../services/venta/venta.service';
import { UsuarioService } from '../../../services/usuario/usuario.service';
import { CarritoCompraService } from '../../../services/carrito-compra/carrito-compra.service';
import { CarritoDetalleService } from '../../../services/carrito-detalle/carrito-detalle.service';
import { InventarioService } from '../../../services/inventario/inventario.service';

import { Venta } from '../../../models/venta/venta.model';
import { Usuario } from '../../../models/usuario/usuario.model';
import { CarritoCompra } from '../../../models/carrito-compra/carrito-compra.model';
import { CarritoDetalle } from '../../../models/carrito-detalle/carrito-detalle.model';
import { Inventario } from '../../../models/inventario/inventario.model';

import { forkJoin, of } from 'rxjs';
import { switchMap, tap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-venta-create',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './venta-create.component.html',
  styleUrls: ['./venta-create.component.scss']
})
export class VentaCreateComponent implements OnInit {
  venta: Venta = { total: '', metodo_pago: '', usuario: 0, carrito: 0 };
  usuarios: Usuario[] = [];
  carritos: CarritoCompra[] = [];
  carritoDetalles: CarritoDetalle[] = [];
  inventarios: Inventario[] = [];
  errorInventario: string | null = null;
  constructor(
    private ventaService: VentaService,
    private usuarioService: UsuarioService,
    private carritoCompraService: CarritoCompraService,
    private carritoDetalleService: CarritoDetalleService,
    private inventarioService: InventarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarCarritos();
    this.cargarInventarios();
  }

  private cargarUsuarios(): void {
    this.usuarioService.obtenerUsuarios().subscribe(usuarios => {
      this.usuarios = usuarios;
      console.log('Usuarios cargados:', usuarios);
    });
  }

  private cargarCarritos(): void {
    this.carritoCompraService.obtenerTodosCarritos().subscribe(carritos => {
      this.carritos = carritos;
      console.log('Carritos cargados:', carritos);
    });
  }

  private cargarInventarios(): void {
    this.inventarioService.obtenerInventarios().subscribe(inventarios => {
      this.inventarios = inventarios;
      console.log('Inventarios cargados:', inventarios);
    });
  }

  onCarritoSelect(idCarrito: number): void {
    this.venta.carrito = idCarrito;
    console.log('Carrito seleccionado:', idCarrito);

    this.carritoDetalleService.obtenerTodosDetalles().pipe(
      tap(all => console.log('Detalles raw obtenidos (onSelect):', all)),
      tap(all => {
        this.carritoDetalles = all.filter(d => d.carrito === idCarrito);
        console.log('Detalles filtrados:', this.carritoDetalles);
      })
    ).subscribe();
  }

  crearVenta(): void { 
    console.log('Iniciando crearVenta. Venta:', this.venta);
    console.log('Detalles actualmente cargados:', this.carritoDetalles);

    if (!this.carritoDetalles.length) {
      console.error('No hay detalles de carrito cargados. Asegúrate de seleccionar un carrito.');
      return;
    }

    // 1) Verificar inventario suficiente antes de crear la venta
    for (const detalle of this.carritoDetalles) {
      const inventario = this.inventarios.find(inv => inv.producto === detalle.producto);

      if (!inventario) {
        this.errorInventario = `No hay inventario disponible para el producto ${detalle.producto}`;
        return;  // Detener proceso
      }

      const nuevaCantidad = inventario.cantidad - detalle.cantidad;
      if (nuevaCantidad < 0) {
        this.errorInventario = `No hay suficiente inventario para el producto ${detalle.producto}. Disponibles: ${inventario.cantidad}`;
        return;  // Detener proceso
      }
    }

    // 2) Crear la venta
    this.ventaService.crearVenta(this.venta).pipe(
      tap(ventaCreada => console.log('Venta creada:', ventaCreada)),
      // 3) Actualizar inventario si la venta es creada con éxito
      switchMap(() => {
        const peticiones = this.carritoDetalles.map(detalle => {
          const inventario = this.inventarios.find(inv => inv.producto === detalle.producto);

          if (!inventario) {
            console.error(`No se encontró inventario para el producto ${detalle.producto}`);
            return of(null);
          }

          console.log(`Inventario encontrado [prod ${detalle.producto}]:`, inventario);

          const nuevaCantidad = inventario.cantidad - detalle.cantidad;
          if (nuevaCantidad < 0) {
            console.error(`Inventario insuficiente para prod ${detalle.producto}: dispon ${inventario.cantidad}, vend ${detalle.cantidad}`);
            return of(null);
          }

          const payload: Inventario = { ...inventario, cantidad: nuevaCantidad };
          console.log('Payload para actualizar:', payload);

          if (inventario.id === undefined) {
            console.error('ID de inventario no encontrado');
            return of(null);
          }

          return this.inventarioService.actualizarInventario(inventario.id, payload).pipe(
            tap(res => console.log('Respuesta update inventario:', res)),
            catchError(err => {
              console.error('Error en update inventario:', err);
              return of(null);
            })
          );
        });

        return forkJoin(peticiones);
      })
    ).subscribe({
      next: results => {
        console.log('Todas las actualizaciones completadas:', results);
        this.router.navigate(['/venta']);
      },
      error: err => {
        console.error('Error en flujo crearVenta:', err);
      }
    });
  }
  

  cancelar(): void {
    this.router.navigate(['/venta']);
  }
}