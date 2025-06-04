// src/app/services/usuario/usuario.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../../models/usuario/usuario.model';
import { environment } from '../../../environments/environment';

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private apiUrl = environment.apiUrl; // p. ej. "http://localhost:8000/api"

  constructor(private http: HttpClient) {}

  obtenerUsuarios(params?: { page?: number; page_size?: number }): Observable<PaginatedResponse<Usuario>> {
    let httpParams = new HttpParams();
    if (params?.page) {
      httpParams = httpParams.set('page', params.page.toString());
    }
    if (params?.page_size) {
      httpParams = httpParams.set('page_size', params.page_size.toString());
    }
    return this.http.get<PaginatedResponse<Usuario>>(
      `${this.apiUrl}/usuarios/`,
      { params: httpParams }
    );
  }

  obtenerUsuarioPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/usuarios/${id}/`);
  }

  crearUsuario(usuario: Usuario): Observable<Usuario> {
    const usuarioSinId = { ...usuario };
    delete usuarioSinId.id;
    return this.http.post<Usuario>(`${this.apiUrl}/usuarios/`, usuarioSinId);
  }

  actualizarUsuario(id: number, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/usuarios/${id}/`, usuario);
  }

  eliminarUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/usuarios/${id}/`);
  }

  /**
   * Nuevo método: buscar usuarios por nombre (o correo) con paginación.
   * Lo usamos para implementar el “autocomplete/typeahead” en el componente de creación de Estudiante.
   *
   * @param term texto que el usuario escribe para filtrar (por ej. nombre)
   * @param page número de página (por defecto 1)
   * @param pageSize cantidad de registros por página (por defecto 20)
   * @returns Observable con { count, next, previous, results: Usuario[] }
   */
  buscarUsuarios(
    term: string,
    page: number = 1,
    pageSize: number = 20
  ): Observable<PaginatedResponse<Usuario>> {
    let httpParams = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());

    // Agregamos filtro “nombre__icontains=term” para que DjangoFilterBackend lo interprete
    if (term && term.trim() !== '') {
      httpParams = httpParams.set('nombre', term.trim());
    }

    // Si solo quieres estudiantes, puedes descomentar la siguiente línea:
    // httpParams = httpParams.set('rol', 'estudiante');

    return this.http.get<PaginatedResponse<Usuario>>(
      `${this.apiUrl}/usuarios/`,
      { params: httpParams }
    );
  }
}
