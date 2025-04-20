import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoriaService } from '../../../services/categoria/categoria.service';
import { Categoria } from '../../../models/categoria/categoria.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-categoria-update',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './categoria-update.component.html',
  styleUrls: ['./categoria-update.component.scss']
})
export class CategoriaUpdateComponent implements OnInit {
  categoria: Categoria = { id: 0, nombre: '', descripcion: '' };

  constructor(
    private categoriaService: CategoriaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.categoriaService.obtenerCategoriaPorId(id).subscribe((data) => {
        this.categoria = data;
      });
    }
  }

  actualizarCategoria(): void {
    if (this.categoria.id) {
      this.categoriaService.actualizarCategoria(this.categoria.id, this.categoria).subscribe(() => {
        this.router.navigate(['/categoria']); // Redirige tras la actualización
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/categoria']);
  }
}
