import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from '../../models/categoria/categoria.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  obtenerCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.apiUrl}/categorias/`);
  }

  obtenerCategoriaPorId(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.apiUrl}/categorias/${id}/`);
  }

  crearCategoria(categoria: Categoria): Observable<Categoria> {
    const categoriaSinId = { ...categoria };
    delete categoriaSinId.id;

    return this.http.post<Categoria>(`${this.apiUrl}/categorias/`, categoriaSinId);
  }

  actualizarCategoria(id: number, categoria: Categoria): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.apiUrl}/categorias/${id}/`, categoria);
  }

  eliminarCategoria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/categorias/${id}/`);
  }
}
