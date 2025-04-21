// src/app/services/venta/venta.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Venta } from '../../models/venta/venta.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VentaService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  obtenerVentas(): Observable<Venta[]> {
    return this.http.get<Venta[]>(`${this.apiUrl}/ventas/`);
  }

  obtenerVentaPorId(id: number): Observable<Venta> {
    return this.http.get<Venta>(`${this.apiUrl}/ventas/${id}/`);
  }

  crearVenta(venta: Venta): Observable<Venta> {
    const payload: any = { ...venta };
    delete payload.id;
    delete payload.fecha;
    delete payload.usuarioNombre;
    return this.http.post<Venta>(`${this.apiUrl}/ventas/`, payload);
  }

  actualizarVenta(id: number, venta: Venta): Observable<Venta> {
    return this.http.put<Venta>(`${this.apiUrl}/ventas/${id}/`, venta);
  }

  eliminarVenta(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/ventas/${id}/`);
  }
}
