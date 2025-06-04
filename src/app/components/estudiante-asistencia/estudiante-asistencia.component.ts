// src/app/components/estudiante-asistencia/estudiante-asistencia.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {
  EstudianteAsistencia,
  EstudianteBasico,
  Asistencia
} from '../../models/estudiante-asistencia/estudiante-asistencia.model';
import { EstudianteAsistenciaService } from '../../services/estudiante-asistencia/estudiante-asistencia.service';

@Component({
  selector: 'app-estudiante-asistencia',
  standalone: true,
  imports: [CommonModule,
    RouterModule],
  templateUrl: './estudiante-asistencia.component.html',
  styleUrls: ['./estudiante-asistencia.component.scss']
})
export class EstudianteAsistenciaComponent implements OnInit {
  estudiantesAsistencias: EstudianteAsistencia[] = [];

  // Parámetros extraídos de la URL
  gestion = '';
  cursoId = 0;
  profesorId = 0;
  materiaId = 0;

  /** 
   * Array de fechas (strings "YYYY-MM-DD") ordenadas ascendiente,
   * que servirá para las columnas de la tabla.
   */
  fechasUnicas: string[] = [];

  /**
   * Mapa para cada estudiante, que asocia fecha → Asistencia
   * Podría ser:
   *   {
   *     [estudianteId: number]: { [fecha: string]: Asistencia }
   *   }
   */
  asistenciasPorEstudiante: {
    [estudianteId: number]: { [fecha: string]: Asistencia }
  } = {};

  constructor(
    private route: ActivatedRoute,
    private asistenciaService: EstudianteAsistenciaService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.gestion = params['gestion_academica_trimestral'];
      this.cursoId = +params['curso_id'];
      this.profesorId = +params['profesor_id'];
      this.materiaId = +params['materia_id'];

      this.cargarAsistencias();
    });
  }

  cargarAsistencias(): void {
    this.asistenciaService.getAsistencias({
      gestion_academica_trimestral: this.gestion,
      curso_id: this.cursoId,
      profesor_id: this.profesorId,
      materia_id: this.materiaId
    }).subscribe({
      next: (data: EstudianteAsistencia[]) => {
        this.estudiantesAsistencias = data;
        this.procesarMatrizAsistencias();
      },
      error: err => {
        console.error('Error al cargar asistencias:', err);
      }
    });
  }

  /**
   * Reconstruye:
   *   1) fechasUnicas = lista ordenada de todas las fechas
   *   2) asistenciasPorEstudiante[estudianteId] = { fecha → Asistencia }
   */
  private procesarMatrizAsistencias(): void {
    const setFechas = new Set<string>();

    // 1) Recorrer cada estudiante y sus asistencias
    this.estudiantesAsistencias.forEach(ea => {
      // Inicializar diccionario para este estudiante
      this.asistenciasPorEstudiante[ea.estudiante.id] = {};

      ea.asistencias.forEach(asist => {
        setFechas.add(asist.fecha);
        // Guardamos el objeto Asistencia completo para esa fecha
        this.asistenciasPorEstudiante[ea.estudiante.id][asist.fecha] = asist;
      });
    });

    // 2) Convertir Set → Array y ordenar cronológicamente
    this.fechasUnicas = Array.from(setFechas)
      .sort((a, b) => a.localeCompare(b)); 
      // Si quisieras asegurarte de orden por fecha real, podrías parsear Date, pero con ISO strings basta.

    // Ahora `fechasUnicas` es p.ej. ['2025-06-02', '2025-06-03', '2025-06-05', ...]
  }

  /**
   * Formatea fecha "YYYY-MM-DD" → "DD/MM/YYYY"
   */
  formatearFecha(fechaISO: string): string {
    const [año, mes, día] = fechaISO.split('-');
    return `${día}/${mes}/${año}`;
  }

  /**
   * Dado un estudiante (por su id) y una fecha, devuelve:
   *   - la cadena con tipo de asistencia (ej. "P")
   *   - o "-" si no hay registro
   */
  obtenerTipoPor(estudianteId: number, fecha: string): string {
    const asistObj = this.asistenciasPorEstudiante[estudianteId]?.[fecha];
    return asistObj ? asistObj.tipo : '-';
  }
}
