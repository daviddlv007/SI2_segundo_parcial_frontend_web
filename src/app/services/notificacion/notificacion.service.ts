import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notificacion } from '../../models/notificacion/notificacion.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificacionService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  obtenerNotificaciones(): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(`${this.apiUrl}/notificaciones/`);
  }

  obtenerNotificacionPorId(id: number): Observable<Notificacion> {
    return this.http.get<Notificacion>(`${this.apiUrl}/notificaciones/${id}/`);
  }

  crearNotificacion(notificacion: Notificacion): Observable<Notificacion> {
    const notificacionSinId = { ...notificacion };
    delete notificacionSinId.id;
    return this.http.post<Notificacion>(`${this.apiUrl}/notificaciones/`, notificacionSinId);
  }

  actualizarNotificacion(id: number, notificacion: Notificacion): Observable<Notificacion> {
    return this.http.put<Notificacion>(`${this.apiUrl}/notificaciones/${id}/`, notificacion);
  }

  eliminarNotificacion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/notificaciones/${id}/`);
  }
}
