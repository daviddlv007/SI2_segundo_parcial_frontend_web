import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CarritoCompra } from '../../models/carrito-compra/carrito-compra.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CarritoCompraService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  obtenerTodosCarritos(): Observable<CarritoCompra[]> {
    return this.http.get<CarritoCompra[]>(`${this.apiUrl}/carritos_compra/`);
  }

  crearCarrito(carrito: CarritoCompra): Observable<CarritoCompra> {
    return this.http.post<CarritoCompra>(`${this.apiUrl}/carritos_compra/`, carrito);
  }

  actualizarCarrito(id: number, carrito: CarritoCompra): Observable<CarritoCompra> {
    return this.http.put<CarritoCompra>(`${this.apiUrl}/carritos_compra/${id}/`, carrito);
  }

  eliminarCarrito(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/carritos_compra/${id}/`);
  }

  obtenerCarritoPorId(id: number): Observable<CarritoCompra> {
    return this.http.get<CarritoCompra>(`${this.apiUrl}/carritos_compra/${id}/`);
  }
}