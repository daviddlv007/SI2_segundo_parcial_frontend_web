import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CarritoDetalle } from '../../models/carrito-detalle/carrito-detalle.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CarritoDetalleService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Obtener todos los detalles (para filtrar en frontend)
  obtenerTodosDetalles(): Observable<CarritoDetalle[]> {
    return this.http.get<CarritoDetalle[]>(`${this.apiUrl}/carritos_detalle/`);
  }

  crearDetalle(detalle: CarritoDetalle): Observable<CarritoDetalle> {
    return this.http.post<CarritoDetalle>(`${this.apiUrl}/carritos_detalle/`, detalle);
  }

  actualizarDetalle(id: number, detalle: CarritoDetalle): Observable<CarritoDetalle> {
    return this.http.put<CarritoDetalle>(`${this.apiUrl}/carritos_detalle/${id}/`, detalle);
  }

  eliminarDetalle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/carritos_detalle/${id}/`);
  }

  obtenerDetallePorId(id: number): Observable<CarritoDetalle> {
    return this.http.get<CarritoDetalle>(`${this.apiUrl}/carritos_detalle/${id}/`);
  }
}