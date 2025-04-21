// src/app/services/inventario/inventario.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inventario } from '../../models/inventario/inventario.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InventarioService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  obtenerInventarios(): Observable<Inventario[]> {
    return this.http.get<Inventario[]>(`${this.apiUrl}/inventarios/`);
  }

  obtenerInventarioPorId(id: number): Observable<Inventario> {
    return this.http.get<Inventario>(`${this.apiUrl}/inventarios/${id}/`);
  }

  crearInventario(inventario: Inventario): Observable<Inventario> {
    const inventarioSinId = { ...inventario };
    delete inventarioSinId.id;
    return this.http.post<Inventario>(`${this.apiUrl}/inventarios/`, inventarioSinId);
  }

  actualizarInventario(id: number, inventario: Inventario): Observable<Inventario> {
    return this.http.put<Inventario>(`${this.apiUrl}/inventarios/${id}/`, inventario);
  }

  eliminarInventario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/inventarios/${id}/`);
  }
}
