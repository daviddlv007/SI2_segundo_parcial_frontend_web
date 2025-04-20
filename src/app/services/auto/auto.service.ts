// src/app/services/auto/auto.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Auto } from '../../models/auto/auto.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AutoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  obtenerAutos(): Observable<Auto[]> {
    return this.http.get<Auto[]>(`${this.apiUrl}/autos/`);
  }

  obtenerAutoPorId(id: number): Observable<Auto> {
    return this.http.get<Auto>(`${this.apiUrl}/autos/${id}/`);
  }

  crearAuto(auto: Auto): Observable<Auto> {
    const autoSinId = { ...auto };
    delete autoSinId.id;
    return this.http.post<Auto>(`${this.apiUrl}/autos/`, autoSinId);
  }

  actualizarAuto(id: number, auto: Auto): Observable<Auto> {
    return this.http.put<Auto>(`${this.apiUrl}/autos/${id}/`, auto);
  }

  eliminarAuto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/autos/${id}/`);
  }
}
