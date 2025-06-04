// src/app/components/estudiante-participacion/estudiante-participacion.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {
  EstudianteParticipacion,
  EstudianteBasico,
  Participacion
} from '../../models/estudiante-participacion/estudiante-participacion.model';
import { EstudianteParticipacionService } from '../../services/estudiante-participacion/estudiante-participacion.service';

@Component({
  selector: 'app-estudiante-participacion',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './estudiante-participacion.component.html',
  styleUrls: ['./estudiante-participacion.component.scss']
})
export class EstudianteParticipacionComponent implements OnInit {
  listaParticipaciones: EstudianteParticipacion[] = [];

  // Parámetros de consulta
  gestion = '';
  cursoId = 0;
  profesorId = 0;
  materiaId = 0;

  /** Fechas únicas (strings "YYYY-MM-DD") ordenadas. */
  fechasUnicas: string[] = [];

  /**
   * Mapa que asocia por estudiante:
   *   { [estudianteId: number]: { [fecha: string]: Participacion } }
   */
  participacionesPorEstudiante: {
    [estudianteId: number]: { [fecha: string]: Participacion }
  } = {};

  constructor(
    private route: ActivatedRoute,
    private partService: EstudianteParticipacionService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.gestion = params['gestion_academica_trimestral'];
      this.cursoId = +params['curso_id'];
      this.profesorId = +params['profesor_id'];
      this.materiaId = +params['materia_id'];
      this.cargarParticipaciones();
    });
  }

  cargarParticipaciones(): void {
    this.partService.getParticipaciones({
      gestion_academica_trimestral: this.gestion,
      curso_id: this.cursoId,
      profesor_id: this.profesorId,
      materia_id: this.materiaId
    }).subscribe({
      next: (data: EstudianteParticipacion[]) => {
        this.listaParticipaciones = data;
        this.procesarMatriz();
      },
      error: err => {
        console.error('Error al cargar participaciones:', err);
      }
    });
  }

  /** 
   * Llena `fechasUnicas` y `participacionesPorEstudiante` a partir de la respuesta.
   */
  private procesarMatriz(): void {
    const setFechas = new Set<string>();

    this.listaParticipaciones.forEach(item => {
      // Inicializar el mapa por estudiante
      this.participacionesPorEstudiante[item.estudiante.id] = {};

      item.participaciones.forEach(p => {
        setFechas.add(p.fecha);
        this.participacionesPorEstudiante[item.estudiante.id][p.fecha] = p;
      });
    });

    // Ordenar fechas cronológicamente (ISO strings)
    this.fechasUnicas = Array.from(setFechas).sort((a, b) => a.localeCompare(b));
  }

  formatearFecha(fechaISO: string): string {
    const [año, mes, día] = fechaISO.split('-');
    return `${día}/${mes}/${año}`;
  }

  /**
   * Devuelve:
   *   - 'Sí' si participó en esa fecha,
   *   - 'No' en caso contrario.
   */
  obtenerTextoParticipacion(estId: number, fecha: string): string {
    const p = this.participacionesPorEstudiante[estId]?.[fecha];
    return p ? (p.participo ? 'Sí' : 'No') : '-';
  }
}
