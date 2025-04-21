// src/app/services/carrito-detalle/carrito-detalle.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CarritoDetalle } from '../../models/carrito-detalle/carrito-detalle.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CarritoDetalleService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  obtenerCarritosDetalle(): Observable<CarritoDetalle[]> {
    return this.http.get<CarritoDetalle[]>(`${this.apiUrl}/carritos_detalle/`);
  }

  obtenerCarritoDetallePorId(id: number): Observable<CarritoDetalle> {
    return this.http.get<CarritoDetalle>(`${this.apiUrl}/carritos_detalle/${id}/`);
  }

  crearCarritoDetalle(detalle: CarritoDetalle): Observable<CarritoDetalle> {
    const detalleSinId = { ...detalle };
    delete detalleSinId.id;
    return this.http.post<CarritoDetalle>(`${this.apiUrl}/carritos_detalle/`, detalleSinId);
  }

  actualizarCarritoDetalle(id: number, detalle: CarritoDetalle): Observable<CarritoDetalle> {
    return this.http.put<CarritoDetalle>(`${this.apiUrl}/carritos_detalle/${id}/`, detalle);
  }

  eliminarCarritoDetalle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/carritos_detalle/${id}/`);
  }

  obtenerDetallesPorCarrito(carritoId: number): Observable<CarritoDetalle[]> {
    return this.http.get<CarritoDetalle[]>(`${this.apiUrl}/carritos_detalle/?carrito=${carritoId}`);
  }
}