// src/app/services/participacion/participacion.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

interface CrearParticipacionPayload {
  participo: boolean;
  fecha: string;                 // "YYYY-MM-DD"
  inscripcion_trimestre: number;
}

@Injectable({
  providedIn: 'root'
})
export class ParticipacionService {
  private readonly baseUrl = `${environment.apiUrl}/participaciones/`;

  constructor(private http: HttpClient) {}

  /**
   * Crea una nueva participación (POST /participaciones/).
   */
  crearParticipacion(payload: CrearParticipacionPayload): Observable<any> {
    return this.http.post<any>(this.baseUrl, payload);
  }

  /**
   * Actualiza una participación existente (PATCH /participaciones/{id}/).
   */
  actualizarParticipacion(id: number, payload: CrearParticipacionPayload): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}${id}/`, payload);
  }
}
