import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InventarioService } from '../../../services/inventario/inventario.service';
import { ProductoService } from '../../../services/producto/producto.service';
import { Inventario } from '../../../models/inventario/inventario.model';
import { Producto } from '../../../models/producto/producto.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inventario-create',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './inventario-create.component.html',
  styleUrls: ['./inventario-create.component.scss']
})
export class InventarioCreateComponent implements OnInit {
  inventario: Inventario = { cantidad: 0, umbral_alerta: 0, producto: 0 };
  productos: Producto[] = [];

  constructor(
    private inventarioService: InventarioService,
    private productoService: ProductoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productoService.obtenerProductos().subscribe(productos => {
      this.productos = productos;
    });
  }

  crearInventario(): void {
    this.inventarioService.crearInventario(this.inventario).subscribe(() => {
      this.router.navigate(['/inventario']);
    });
  }

  cancelar(): void {
    this.router.navigate(['/inventario']);
  }
}
