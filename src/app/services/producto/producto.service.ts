// src/app/services/producto/producto.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../../models/producto/producto.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  obtenerProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/productos/`);
  }

  obtenerProductoPorId(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/productos/${id}/`);
  }

  crearProducto(producto: Producto): Observable<Producto> {
    const productoSinId = { ...producto };
    delete productoSinId.id;
    return this.http.post<Producto>(`${this.apiUrl}/productos/`, productoSinId);
  }

  actualizarProducto(id: number, producto: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrl}/productos/${id}/`, producto);
  }

  eliminarProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/productos/${id}/`);
  }
}
