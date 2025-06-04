// src/app/services/estudiante/estudiante.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Estudiante } from '../../models/estudiante/estudiante.model';
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
export class EstudianteService {
  private apiUrl = environment.apiUrl; // p. ej. "http://localhost:8000/api"

  constructor(private http: HttpClient) {}

  obtenerEstudiantes(params?: { page?: number; page_size?: number }): Observable<PaginatedResponse<Estudiante>> {
    let httpParams = new HttpParams();
    if (params?.page) {
      httpParams = httpParams.set('page', params.page.toString());
    }
    if (params?.page_size) {
      httpParams = httpParams.set('page_size', params.page_size.toString());
    }
    return this.http.get<PaginatedResponse<Estudiante>>(
      `${this.apiUrl}/estudiantes/`,
      { params: httpParams }
    );
  }

  obtenerEstudiantePorId(id: number): Observable<Estudiante> {
    return this.http.get<Estudiante>(`${this.apiUrl}/estudiantes/${id}/`);
  }

  crearEstudiante(estudiante: Estudiante): Observable<Estudiante> {
    // Copiamos el objeto y eliminamos cualquier propiedad extra (id, usuarioNombre, cursoNombre, etc.)
    const registro: any = {
      fecha_nacimiento: estudiante.fecha_nacimiento,
      genero: estudiante.genero,
      nombre_padre: estudiante.nombre_padre,
      nombre_madre: estudiante.nombre_madre,
      ci_tutor: estudiante.ci_tutor,
      direccion: estudiante.direccion,
      telefono: estudiante.telefono,
      usuario: estudiante.usuario, // solo el ID del Usuario
      curso: estudiante.curso      // solo el ID del Curso
    };
    console.log('Enviando estudiante al backend:', JSON.stringify(registro, null, 2));

    return this.http.post<Estudiante>(`${this.apiUrl}/estudiantes/`, registro);
  }

  actualizarEstudiante(id: number, estudiante: Estudiante): Observable<Estudiante> {
    // Al actualizar, suponemos que el objeto ya trae id y los campos correctos (usuario, curso, etc.)
    const payload: any = {
      fecha_nacimiento: estudiante.fecha_nacimiento,
      genero: estudiante.genero,
      nombre_padre: estudiante.nombre_padre,
      nombre_madre: estudiante.nombre_madre,
      ci_tutor: estudiante.ci_tutor,
      direccion: estudiante.direccion,
      telefono: estudiante.telefono,
      usuario: estudiante.usuario,
      curso: estudiante.curso
    };
    return this.http.put<Estudiante>(
      `${this.apiUrl}/estudiantes/${id}/`,
      payload
    );
  }

  eliminarEstudiante(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/estudiantes/${id}/`);
  }
}
