import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';  // Importamos tap desde rxjs/operators
import { Inventario } from '../../models/inventario/inventario.model';
import { NotificacionService } from '../notificacion/notificacion.service'; // Importamos el servicio de notificaciones
import { environment } from '../../../environments/environment';
import { ProductoService } from '../producto/producto.service'; 

@Injectable({
  providedIn: 'root',
})
export class InventarioService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private notificacionService: NotificacionService,
    private productoService: ProductoService
  ) {}

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
    return this.http.put<Inventario>(`${this.apiUrl}/inventarios/${id}/`, inventario).pipe(
      tap((inventarioActualizado: Inventario) => {
        if (inventarioActualizado.cantidad <= inventarioActualizado.umbral_alerta) {
          const fechaActual = new Date().toLocaleString();
  
          // Obtener el nombre del producto
          this.productoService.obtenerProductoPorId(inventarioActualizado.producto).subscribe({
            next: (producto) => {
              const notificacion = {
                mensaje: `El producto "${producto.nombre}" tiene stock bajo. Fecha de notificación: ${fechaActual}`,
                tipo: 'stock_bajo',
                estado: 'enviado',
                usuario: 1,
              };
  
              this.notificacionService.crearNotificacion(notificacion).subscribe({
                next: () => console.log('Notificación creada por stock bajo'),
                error: (err) => console.error('Error al crear la notificación', err),
              });
            },
            error: (err) => {
              console.error('Error al obtener el producto', err);
            }
          });
        }
      })
    );
  }
  

  eliminarInventario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/inventarios/${id}/`);
  }
}
