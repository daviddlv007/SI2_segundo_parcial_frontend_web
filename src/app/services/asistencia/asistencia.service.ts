// src/app/services/asistencia/asistencia.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

interface CrearAsistenciaPayload {
  fecha: string;
  tipo: string;
  observaciones: string;
  inscripcion_trimestre: number;
}

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {
  // Base URL: /asistencias
  private readonly baseUrl = `${environment.apiUrl}/asistencias/`;

  constructor(private http: HttpClient) {}

  /**
   * Crea una nueva asistencia enviando un POST a /asistencias/
   * con este body:
   * {
   *   "fecha": "2025-06-03",
   *   "tipo": "P",
   *   "observaciones": "string",
   *   "inscripcion_trimestre": 3316
   * }
   */
  crearAsistencia(payload: CrearAsistenciaPayload): Observable<any> {
    return this.http.post<any>(this.baseUrl, payload);
  }
}
