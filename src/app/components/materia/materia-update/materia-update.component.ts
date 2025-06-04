// src/app/components/materia/materia-update/materia-update.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MateriaService } from '../../../services/materia/materia.service';
import { Materia } from '../../../models/materia/materia.model';

@Component({
  selector: 'app-materia-update',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './materia-update.component.html',
  styleUrls: ['./materia-update.component.scss']
})
export class MateriaUpdateComponent implements OnInit {
  materia: Materia = {
    nombre: '',
    descripcion: ''
  };

  materiaId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private materiaService: MateriaService
  ) {}

  ngOnInit(): void {
    this.materiaId = Number(this.route.snapshot.paramMap.get('id'));
    this.materiaService.obtenerMateriaPorId(this.materiaId)
      .subscribe(m => {
        this.materia = m;
      }, err => {
        console.error('Error al cargar materia:', err);
      });
  }

  actualizarMateria(): void {
    this.materiaService.actualizarMateria(this.materiaId, this.materia)
      .subscribe(() => {
        this.router.navigate(['admin/materia']);
      }, err => {
        console.error('Error al actualizar materia:', err);
      });
  }

  cancelar(): void {
    this.router.navigate(['admin/materia']);
  }
}
