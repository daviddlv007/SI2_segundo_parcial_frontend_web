// src/app/services/profesor/profesor.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Profesor } from '../../models/profesor/profesor.model';
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
export class ProfesorService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  obtenerProfesores(params?: { page?: number; page_size?: number }): Observable<PaginatedResponse<Profesor>> {
    let httpParams = new HttpParams();
    if (params?.page) {
      httpParams = httpParams.set('page', params.page);
    }
    if (params?.page_size) {
      httpParams = httpParams.set('page_size', params.page_size);
    }

    return this.http.get<PaginatedResponse<Profesor>>(
      `${this.apiUrl}/profesores/`,
      { params: httpParams }
    );
  }

  obtenerProfesorPorId(id: number): Observable<Profesor> {
    return this.http.get<Profesor>(`${this.apiUrl}/profesores/${id}/`);
  }

  crearProfesor(profesor: Profesor): Observable<Profesor> {
    // Al crear, no se debe enviar el campo 'id'
    const registro: any = { ...profesor };
    delete registro.id;
    return this.http.post<Profesor>(`${this.apiUrl}/profesores/`, registro);
  }

  actualizarProfesor(id: number, profesor: Profesor): Observable<Profesor> {
    return this.http.put<Profesor>(
      `${this.apiUrl}/profesores/${id}/`,
      profesor
    );
  }

  eliminarProfesor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/profesores/${id}/`);
  }
}
