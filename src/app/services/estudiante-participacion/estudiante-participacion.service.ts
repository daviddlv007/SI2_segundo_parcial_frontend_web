// src/app/services/estudiante-participacion/estudiante-participacion.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  EstudianteParticipacion
} from '../../models/estudiante-participacion/estudiante-participacion.model';

@Injectable({
  providedIn: 'root'
})
export class EstudianteParticipacionService {
  private readonly baseUrl = `${environment.apiUrl}/estudiantes-participaciones`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista de estudiantes con sus participaciones, filtrado por parámetros.
   */
  getParticipaciones(params: {
    gestion_academica_trimestral: string;
    curso_id: number;
    profesor_id: number;
    materia_id: number;
  }): Observable<EstudianteParticipacion[]> {
    const query = `?gestion_academica_trimestral=${params.gestion_academica_trimestral}` +
                  `&curso_id=${params.curso_id}` +
                  `&profesor_id=${params.profesor_id}` +
                  `&materia_id=${params.materia_id}`;

    return this.http.get<EstudianteParticipacion[]>(`${this.baseUrl}/${query}`);
  }
}
