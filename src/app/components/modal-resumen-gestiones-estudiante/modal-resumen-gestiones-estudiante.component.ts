import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EstudianteClaseService } from '../../services/estudiante-clase/estudiante-clase.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-resumen-gestiones-estudiante',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-resumen-gestiones-estudiante.component.html',
  styleUrls: ['./modal-resumen-gestiones-estudiante.component.scss']
})
export class ModalResumenGestionesEstudianteComponent implements OnInit {
  @Input() estudianteId: number | null = null;
  @Output() cerrar = new EventEmitter<void>();
  resumenGestiones: any[] = [];
  cargando = false;
  error = '';

  promedioRendimientoReal: number | null = null;

  constructor(private estudianteService: EstudianteClaseService) {}

  ngOnInit(): void {
    if (this.estudianteId) {
      this.cargarResumen();
    }
  }

  cargarResumen(): void {
    this.cargando = true;
    this.error = '';
    if (this.estudianteId !== null) {
      this.estudianteService.getResumenGestionesEstudiante(this.estudianteId)
        .subscribe({
          next: data => {
            this.resumenGestiones = data;
            this.promedioRendimientoReal = this.calcularPromedioRendimientoReal(data);
            this.cargando = false;
          },
          error: err => {
            console.error('Error al obtener resumen:', err);
            this.error = 'Error al cargar el resumen: ' + (err.message || err.statusText || 'Desconocido');
            this.cargando = false;
          }
        });
    }
  }

  calcularPromedioRendimientoReal(resumen: any[]): number | null {
    const valores = resumen
      .map(item => item.promedio_rendimiento_academico_real)
      .filter(valor => typeof valor === 'number');

    if (valores.length === 0) return null;

    const suma = valores.reduce((a, b) => a + b, 0);
    return suma / valores.length;
  }

  cerrarModal(): void {
    this.cerrar.emit();
  }
}
