// src/app/services/estudiante-asistencia/estudiante-asistencia.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  EstudianteAsistencia
} from '../../models/estudiante-asistencia/estudiante-asistencia.model';

@Injectable({
  providedIn: 'root'
})
export class EstudianteAsistenciaService {
  private readonly baseUrl = `${environment.apiUrl}/estudiantes-asistencias`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista de estudiantes con sus asistencias, filtrado por parámetros.
   * @param params Objeto con los parámetros de consulta: gestión, curso, profesor y materia.
   */
  getAsistencias(params: {
    gestion_academica_trimestral: string;
    curso_id: number;
    profesor_id: number;
    materia_id: number;
  }): Observable<EstudianteAsistencia[]> {
    const query = `?gestion_academica_trimestral=${params.gestion_academica_trimestral}`
                + `&curso_id=${params.curso_id}`
                + `&profesor_id=${params.profesor_id}`
                + `&materia_id=${params.materia_id}`;

    return this.http.get<EstudianteAsistencia[]>(`${this.baseUrl}/${query}`);
  }
}
