// src/app/services/inscripcion-trimestral/inscripcion-trimestral.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

interface InscripcionTrimestralResponse {
  id_inscripcion_trimestral: number;
}

@Injectable({
  providedIn: 'root'
})
export class InscripcionTrimestralService {
  // Base URL: /inscripcion-trimestral/id
  private readonly baseUrl = `${environment.apiUrl}/inscripcion-trimestral/id`;

  constructor(private http: HttpClient) {}

  /**
   * Recupera el ID de la inscripción trimestral para un estudiante dado.
   * La API responde con { "id_inscripcion_trimestral": 3316 }
   */
  getId(params: {
    gestion_academica_trimestral: string;
    curso_id: number;
    profesor_id: number;
    materia_id: number;
    estudiante_id: number;
  }): Observable<InscripcionTrimestralResponse> {
    const query = `?gestion_academica_trimestral=${params.gestion_academica_trimestral}`
                + `&curso_id=${params.curso_id}`
                + `&profesor_id=${params.profesor_id}`
                + `&materia_id=${params.materia_id}`
                + `&estudiante_id=${params.estudiante_id}`;
    // La API espera: /inscripcion-trimestral/id/?param1=...&param2=...
    return this.http.get<InscripcionTrimestralResponse>(`${this.baseUrl}${query}`);
  }
}
