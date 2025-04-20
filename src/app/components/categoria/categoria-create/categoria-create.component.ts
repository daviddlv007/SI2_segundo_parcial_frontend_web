import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoriaService } from '../../../services/categoria/categoria.service';
import { Categoria } from '../../../models/categoria/categoria.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categoria-create',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './categoria-create.component.html',
  styleUrls: ['./categoria-create.component.scss']
})
export class CategoriaCreateComponent {
  categoria: Categoria = { nombre: '', descripcion: '' };

  constructor(
    private categoriaService: CategoriaService,
    private router: Router
  ) {}

  // Función para crear la categoría
  crearCategoria(): void {
    this.categoriaService.crearCategoria(this.categoria).subscribe(() => {
      this.router.navigate(['/categoria']);  // Redirige al componente principal después de crear
    });
  }

  // Función para cancelar y volver a la lista de categorías
  cancelar(): void {
    this.router.navigate(['/categoria']);  // Redirige a la lista de categorías
  }
}
