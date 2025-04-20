// src/app/components/producto/producto-create/producto-create.component.ts

import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Producto } from '../../../models/producto/producto.model';
import { Categoria } from '../../../models/categoria/categoria.model';
import { ProductoService } from '../../../services/producto/producto.service';
import { CategoriaService } from '../../../services/categoria/categoria.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-producto-create',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './producto-create.component.html',
  styleUrls: ['./producto-create.component.scss']
})
export class ProductoCreateComponent implements OnInit {
  producto: Producto = {
    nombre: '',
    descripcion: '',
    precio: '',
    url_imagen: '',
    categoria: 0
  };

  categorias: Categoria[] = [];

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.categoriaService.obtenerCategorias().subscribe(categorias => {
      this.categorias = categorias;
    });
  }

  crearProducto(): void {
    this.productoService.crearProducto(this.producto).subscribe(() => {
      this.router.navigate(['/producto']);
    });
  }

  cancelar(): void {
    this.router.navigate(['/producto']);
  }
}
