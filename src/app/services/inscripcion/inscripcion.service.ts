// src/app/services/inscripcion/inscripcion.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inscripcion } from '../../models/inscripcion/inscripcion.model';
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
export class InscripcionService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  obtenerInscripciones(params?: { page?: number; page_size?: number }): Observable<PaginatedResponse<Inscripcion>> {
    let httpParams = new HttpParams();
    if (params?.page) {
      httpParams = httpParams.set('page', params.page);
    }
    if (params?.page_size) {
      httpParams = httpParams.set('page_size', params.page_size);
    }

    return this.http.get<PaginatedResponse<Inscripcion>>(
      `${this.apiUrl}/inscripciones/`,
      { params: httpParams }
    );
  }

  obtenerInscripcionPorId(id: number): Observable<Inscripcion> {
    return this.http.get<Inscripcion>(`${this.apiUrl}/inscripciones/${id}/`);
  }

  crearInscripcion(inscripcion: Inscripcion): Observable<Inscripcion> {
    const registro: any = { ...inscripcion };
    delete registro.id;
    return this.http.post<Inscripcion>(`${this.apiUrl}/inscripciones/`, registro);
  }

  actualizarInscripcion(id: number, inscripcion: Inscripcion): Observable<Inscripcion> {
    return this.http.put<Inscripcion>(
      `${this.apiUrl}/inscripciones/${id}/`,
      inscripcion
    );
  }

  eliminarInscripcion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/inscripciones/${id}/`);
  }
}
