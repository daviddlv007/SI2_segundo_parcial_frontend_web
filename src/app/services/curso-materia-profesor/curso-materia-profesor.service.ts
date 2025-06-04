// src/app/services/curso-materia-profesor/curso-materia-profesor.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CursoMateriaProfesor } from '../../models/curso-materia-profesor/curso-materia-profesor.model';
import { environment } from '../../../environments/environment';

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

@Injectable({
  providedIn: 'root',
})
export class CursoMateriaProfesorService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  obtenerAsignaciones(params?: { page?: number; page_size?: number }): Observable<PaginatedResponse<CursoMateriaProfesor>> {
    let httpParams = new HttpParams();
    if (params?.page) {
      httpParams = httpParams.set('page', params.page);
    }
    if (params?.page_size) {
      httpParams = httpParams.set('page_size', params.page_size);
    }

    return this.http.get<PaginatedResponse<CursoMateriaProfesor>>(
      `${this.apiUrl}/curso_materia_profesor/`,
      { params: httpParams }
    );
  }

  obtenerAsignacionPorId(id: number): Observable<CursoMateriaProfesor> {
    return this.http.get<CursoMateriaProfesor>(`${this.apiUrl}/curso_materia_profesor/${id}/`);
  }

  crearAsignacion(asignacion: CursoMateriaProfesor): Observable<CursoMateriaProfesor> {
    const registro: any = { ...asignacion };
    delete registro.id;
    return this.http.post<CursoMateriaProfesor>(`${this.apiUrl}/curso_materia_profesor/`, registro);
  }

  actualizarAsignacion(id: number, asignacion: CursoMateriaProfesor): Observable<CursoMateriaProfesor> {
    return this.http.put<CursoMateriaProfesor>(`${this.apiUrl}/curso_materia_profesor/${id}/`, asignacion);
  }

  eliminarAsignacion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/curso_materia_profesor/${id}/`);
  }
}
