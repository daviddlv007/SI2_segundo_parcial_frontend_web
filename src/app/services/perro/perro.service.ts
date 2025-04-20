// src/app/services/perro/perro.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Perro } from '../../models/perro/perro.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PerroService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  obtenerPerros(): Observable<Perro[]> {
    return this.http.get<Perro[]>(`${this.apiUrl}/perros/`);
  }

  obtenerPerroPorId(id: number): Observable<Perro> {
    return this.http.get<Perro>(`${this.apiUrl}/perros/${id}/`);
  }

  crearPerro(perro: Perro): Observable<Perro> {
    const perroSinId = { ...perro };
    delete perroSinId.id;
    return this.http.post<Perro>(`${this.apiUrl}/perros/`, perroSinId);
  }

  actualizarPerro(id: number, perro: Perro): Observable<Perro> {
    return this.http.put<Perro>(`${this.apiUrl}/perros/${id}/`, perro);
  }

  eliminarPerro(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/perros/${id}/`);
  }
}
