// src/app/services/estudiante-evaluacion-legal/estudiante-evaluacion-legal.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  EstudianteEvaluacionLegal
} from '../../models/estudiante-evaluacion-legal/estudiante-evaluacion-legal.model';

@Injectable({
  providedIn: 'root'
})
export class EstudianteEvaluacionLegalService {
  // Base URL: /estudiantes-evaluaciones-legales
  private readonly baseUrl = `${environment.apiUrl}/estudiantes-evaluaciones-legales`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista de estudiantes con su evaluacion_legal, filtrado por parámetros.
   */
  getEvaluaciones(params: {
    gestion_academica_trimestral: string;
    curso_id: number;
    profesor_id: number;
    materia_id: number;
  }): Observable<EstudianteEvaluacionLegal[]> {
    const query = `?gestion_academica_trimestral=${params.gestion_academica_trimestral}`
                + `&curso_id=${params.curso_id}`
                + `&profesor_id=${params.profesor_id}`
                + `&materia_id=${params.materia_id}`;

    return this.http.get<EstudianteEvaluacionLegal[]>(`${this.baseUrl}/${query}`);
  }
}
