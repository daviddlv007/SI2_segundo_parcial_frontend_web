import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Materia } from '../../models/materia/materia.model';
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
export class MateriaService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  obtenerMaterias(params?: { page?: number; page_size?: number }): Observable<PaginatedResponse<Materia>> {
    let httpParams = new HttpParams();
    if (params?.page) {
      httpParams = httpParams.set('page', params.page);
    }
    if (params?.page_size) {
      httpParams = httpParams.set('page_size', params.page_size);
    }

    return this.http.get<PaginatedResponse<Materia>>(`${this.apiUrl}/materias/`, { params: httpParams });
  }

  obtenerMateriaPorId(id: number): Observable<Materia> {
    return this.http.get<Materia>(`${this.apiUrl}/materias/${id}/`);
  }

  crearMateria(materia: Materia): Observable<Materia> {
    const materiaSinId = { ...materia };
    delete materiaSinId.id;
    return this.http.post<Materia>(`${this.apiUrl}/materias/`, materiaSinId);
  }

  actualizarMateria(id: number, materia: Materia): Observable<Materia> {
    return this.http.put<Materia>(`${this.apiUrl}/materias/${id}/`, materia);
  }

  eliminarMateria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/materias/${id}/`);
  }
}
