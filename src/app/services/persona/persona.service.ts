import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Persona } from '../../models/persona/persona.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PersonaService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  obtenerPersonas(): Observable<Persona[]> {
    return this.http.get<Persona[]>(`${this.apiUrl}/personas/`);
  }

  obtenerPersonaPorId(id: number): Observable<Persona> {
    return this.http.get<Persona>(`${this.apiUrl}/personas/${id}/`);
  }

  crearPersona(persona: Persona): Observable<Persona> {
    const personaSinId = { ...persona };
    delete personaSinId.id;

    return this.http.post<Persona>(`${this.apiUrl}/personas/`, personaSinId);
  }

  actualizarPersona(id: number, persona: Persona): Observable<Persona> {
    return this.http.put<Persona>(`${this.apiUrl}/personas/${id}/`, persona);
  }

  eliminarPersona(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/personas/${id}/`);
  }
}
