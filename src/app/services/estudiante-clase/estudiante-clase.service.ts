// src/app/services/estudiante-clase/estudiante-clase.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Estudiante } from '../../models/estudiante-clase/estudiante-clase.model';

@Injectable({
  providedIn: 'root'
})
export class EstudianteClaseService {
  private readonly baseUrl = `${environment.apiUrl}/estudiantes-clase`;

  constructor(private http: HttpClient) {}

  getEstudiantes(params: {
    gestion_academica_trimestral: string,
    curso_id: number,
    profesor_id: number,
    materia_id: number
  }): Observable<Estudiante[]> {
    const query = `?gestion_academica_trimestral=${params.gestion_academica_trimestral}&curso_id=${params.curso_id}&profesor_id=${params.profesor_id}&materia_id=${params.materia_id}`;

    return this.http.get<Estudiante[]>(`${this.baseUrl}/${query}`);
  }

  getResumenGestionesEstudiante(idEstudiante: number) {
  return this.http.get<any[]>(`${environment.apiUrl}/resumen-gestiones/estudiante/${idEstudiante}/`);
}

}
