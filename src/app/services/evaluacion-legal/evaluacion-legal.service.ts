// src/app/services/evaluacion-legal/evaluacion-legal.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

interface CrearEvaluacionLegalPayload {
  // Campos necesarios para crear una Evaluación Legal:
  nota_saber_evaluacion_profesor: string;
  nota_hacer_evaluacion_profesor: string;
  nota_ser_evaluacion_profesor: string;
  nota_decidir_evaluacion_profesor: string;

  nota_ser_evaluacion_estudiante: string;
  nota_decidir_evaluacion_estudiante: string;

  // Campos calculados (derivados) que enviaremos en el body:
  nota_evaluacion_profesor: string;
  nota_evaluacion_estudiante: string;
  nota_evaluacion_legal: string;

  inscripcion_trimestre: number;
}

@Injectable({
  providedIn: 'root'
})
export class EvaluacionLegalService {
  // Base URL: /evaluaciones-legales/
  private readonly baseUrl = `${environment.apiUrl}/evaluaciones_legales/`;

  constructor(private http: HttpClient) {}

  /**
   * Crea una nueva evaluación legal enviando un POST a /evaluaciones-legales/
   */
  crearEvaluacionLegal(payload: CrearEvaluacionLegalPayload): Observable<any> {
    return this.http.post<any>(this.baseUrl, payload);
  }
}
