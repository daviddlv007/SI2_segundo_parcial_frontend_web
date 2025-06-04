// src/app/services/curso/curso.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Curso } from '../../models/curso/curso.model';
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
export class CursoService {
  private apiUrl = environment.apiUrl; // p. ej. "http://localhost:8000/api"

  constructor(private http: HttpClient) {}

  obtenerCursos(params?: { page?: number; page_size?: number }): Observable<PaginatedResponse<Curso>> {
    let httpParams = new HttpParams();
    if (params?.page) {
      httpParams = httpParams.set('page', params.page.toString());
    }
    if (params?.page_size) {
      httpParams = httpParams.set('page_size', params.page_size.toString());
    }

    return this.http.get<PaginatedResponse<Curso>>(
      `${this.apiUrl}/cursos/`,
      { params: httpParams }
    );
  }

  obtenerCursoPorId(id: number): Observable<Curso> {
    return this.http.get<Curso>(`${this.apiUrl}/cursos/${id}/`);
  }

  crearCurso(curso: Curso): Observable<Curso> {
    const cursoSinId = { ...curso };
    delete cursoSinId.id;
    return this.http.post<Curso>(`${this.apiUrl}/cursos/`, cursoSinId);
  }

  actualizarCurso(id: number, curso: Curso): Observable<Curso> {
    return this.http.put<Curso>(`${this.apiUrl}/cursos/${id}/`, curso);
  }

  eliminarCurso(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/cursos/${id}/`);
  }

  /**
   * Nuevo método: busca cursos cuyo nombre contenga el término dado (paginado).
   * Útil para autocomplete en el formulario de EstudianteCreate.
   */
  buscarCursos(
    term: string,
    page: number = 1,
    pageSize: number = 20
  ): Observable<PaginatedResponse<Curso>> {
    let httpParams = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());

    if (term && term.trim() !== '') {
      // Filtramos por coincidencia parcial en el campo 'nombre'
      httpParams = httpParams.set('nombre__icontains', term.trim());
    }

    return this.http.get<PaginatedResponse<Curso>>(
      `${this.apiUrl}/cursos/`,
      { params: httpParams }
    );
  }
}
