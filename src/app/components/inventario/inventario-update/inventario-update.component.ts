// src/app/components/inventario/inventario-update/inventario-update.component.ts

import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { InventarioService } from '../../../services/inventario/inventario.service';
import { ProductoService } from '../../../services/producto/producto.service';
import { Inventario } from '../../../models/inventario/inventario.model';
import { Producto } from '../../../models/producto/producto.model';

@Component({
  selector: 'app-inventario-update',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './inventario-update.component.html',
  styleUrls: ['./inventario-update.component.scss']
})
export class InventarioUpdateComponent implements OnInit {
  inventario: Inventario = { cantidad: 0, umbral_alerta: 0, producto: 0 };
  productos: Producto[] = [];

  constructor(
    private inventarioService: InventarioService,
    private productoService: ProductoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.inventarioService.obtenerInventarioPorId(id).subscribe(inventarioBackend => {
        this.inventario = inventarioBackend;
      });
    }
  }

  private cargarProductos(): void {
    this.productoService.obtenerProductos().subscribe(productos => {
      this.productos = productos;
    });
  }

  actualizarInventario(): void {
    if (!this.inventario.id) return;
    this.inventarioService.actualizarInventario(this.inventario.id, this.inventario)
      .subscribe(() => this.router.navigate(['/inventario']));
  }

  cancelar(): void {
    this.router.navigate(['/inventario']);
  }
}
