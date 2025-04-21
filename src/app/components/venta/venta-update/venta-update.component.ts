// src/app/components/venta/venta-update/venta-update.component.ts

import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { VentaService } from '../../../services/venta/venta.service';
import { UsuarioService } from '../../../services/usuario/usuario.service';
import { CarritoCompraService } from '../../../services/carrito-compra/carrito-compra.service';
import { Venta } from '../../../models/venta/venta.model';
import { Usuario } from '../../../models/usuario/usuario.model';
import { CarritoCompra } from '../../../models/carrito-compra/carrito-compra.model';

@Component({
  selector: 'app-venta-update',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './venta-update.component.html',
  styleUrls: ['./venta-update.component.scss']
})
export class VentaUpdateComponent implements OnInit {
  venta: Venta = { total: '', metodo_pago: '', usuario: 0, carrito: 0 };
  usuarios: Usuario[] = [];
  carritos: CarritoCompra[] = [];

  constructor(
    private ventaService: VentaService,
    private usuarioService: UsuarioService,
    private carritoService: CarritoCompraService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarCarritos();
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.ventaService.obtenerVentaPorId(id).subscribe(ventaBackend => {
        this.venta = ventaBackend;
      });
    }
  }

  private cargarUsuarios(): void {
    this.usuarioService.obtenerUsuarios().subscribe(usuarios => {
      this.usuarios = usuarios;
    });
  }

  private cargarCarritos(): void {
    this.carritoService.obtenerTodosCarritos().subscribe(carritos => {
      this.carritos = carritos;
    });
  }

  actualizarVenta(): void {
    if (!this.venta.id) return;
    this.ventaService.actualizarVenta(this.venta.id, this.venta)
      .subscribe(() => this.router.navigate(['/venta']));
  }

  cancelar(): void {
    this.router.navigate(['/venta']);
  }
}
