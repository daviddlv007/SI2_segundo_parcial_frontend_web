import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth/auth.service';
import { CursoMateria } from '../../models/curso-materia/curso-materia.model';

@Injectable({
  providedIn: 'root'
})
export class CursoMateriaService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /**
   * Paso 1: obtiene profesor_id desde usuario_id autenticado
   * Paso 2: usa profesor_id para obtener cursos-materias
   */
  getCursosMaterias(gestionTrimestral: string): Observable<CursoMateria[]> {
    const usuarioId = this.authService.getUserId();

    return this.http.get<{ profesor_id: number }>(
      `${environment.apiUrl}/profesor/por-usuario/?usuario_id=${usuarioId}`
    ).pipe(
      switchMap((profesor) => {
        const profesorId = profesor.profesor_id;
        return this.http.get<CursoMateria[]>(
          `${environment.apiUrl}/cursos-materias/?profesor_id=${profesorId}&gestion_trimestral=${gestionTrimestral}`
        );
      })
    );
  }

}
