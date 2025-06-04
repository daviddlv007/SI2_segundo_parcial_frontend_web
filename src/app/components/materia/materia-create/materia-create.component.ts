// src/app/components/materia/materia-create/materia-create.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MateriaService } from '../../../services/materia/materia.service';
import { Materia } from '../../../models/materia/materia.model';

@Component({
  selector: 'app-materia-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './materia-create.component.html',
  styleUrls: ['./materia-create.component.scss']
})
export class MateriaCreateComponent {
  materia: Materia = {
    nombre: '',
    descripcion: ''
  };

  constructor(
    private materiaService: MateriaService,
    private router: Router
  ) {}

  crearMateria(): void {
    this.materiaService.crearMateria(this.materia)
      .subscribe(() => {
        this.router.navigate(['admin/materia']);
      }, err => {
        console.error('Error al crear materia:', err);
      });
  }

  cancelar(): void {
    this.router.navigate(['admin/materia']);
  }
}
