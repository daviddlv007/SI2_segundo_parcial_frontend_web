// src/app/components/producto/producto-update/producto-update.component.ts

import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from '../../../services/producto/producto.service';
import { CategoriaService } from '../../../services/categoria/categoria.service';
import { Producto } from '../../../models/producto/producto.model';
import { Categoria } from '../../../models/categoria/categoria.model';

@Component({
  selector: 'app-producto-update',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './producto-update.component.html',
  styleUrls: ['./producto-update.component.scss']
})
export class ProductoUpdateComponent implements OnInit {
  producto: Producto = { nombre: '', descripcion: '', precio: '', url_imagen: '', categoria: 0 };
  categorias: Categoria[] = [];

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.productoService.obtenerProductoPorId(id).subscribe(productoBackend => {
        this.producto = productoBackend;
      });
    }
  }

  private cargarCategorias(): void {
    this.categoriaService.obtenerCategorias().subscribe(categorias => {
      this.categorias = categorias;
    });
  }

  actualizarProducto(): void {
    if (!this.producto.id) return;
    this.productoService.actualizarProducto(this.producto.id, this.producto)
      .subscribe(() => this.router.navigate(['/producto']));
  }

  cancelar(): void {
    this.router.navigate(['/producto']);
  }
}
