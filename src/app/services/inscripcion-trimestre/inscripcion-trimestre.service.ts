// src/app/services/inscripcion-trimestre/inscripcion-trimestre.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InscripcionTrimestre } from '../../models/inscripcion-trimestre/inscripcion-trimestre.model';
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
export class InscripcionTrimestreService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  obtenerInscripcionesTrimestrales(params?: { page?: number; page_size?: number }): Observable<PaginatedResponse<InscripcionTrimestre>> {
    let httpParams = new HttpParams();
    if (params?.page) {
      httpParams = httpParams.set('page', params.page);
    }
    if (params?.page_size) {
      httpParams = httpParams.set('page_size', params.page_size);
    }

    return this.http.get<PaginatedResponse<InscripcionTrimestre>>(
      `${this.apiUrl}/inscripciones_trimestre/`,
      { params: httpParams }
    );
  }

  obtenerInscripcionTrimestralPorId(id: number): Observable<InscripcionTrimestre> {
    return this.http.get<InscripcionTrimestre>(
      `${this.apiUrl}/inscripciones_trimestre/${id}/`
    );
  }

  crearInscripcionTrimestral(inscripcionTri: InscripcionTrimestre): Observable<InscripcionTrimestre> {
    const registro: any = { ...inscripcionTri };
    delete registro.id;
    return this.http.post<InscripcionTrimestre>(
      `${this.apiUrl}/inscripciones_trimestre/`,
      registro
    );
  }

  actualizarInscripcionTrimestral(id: number, inscripcionTri: InscripcionTrimestre): Observable<InscripcionTrimestre> {
    return this.http.put<InscripcionTrimestre>(
      `${this.apiUrl}/inscripciones_trimestre/${id}/`,
      inscripcionTri
    );
  }

  eliminarInscripcionTrimestral(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/inscripciones_trimestre/${id}/`
    );
  }
}
