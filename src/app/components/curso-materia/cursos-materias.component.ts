import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CursoMateriaService } from '../../services/curso-materia/curso-materia.service';
import { CursoMateria } from '../../models/curso-materia/curso-materia.model';
import { AuthService } from '../../services/auth/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-cursos-materias',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    FormsModule
  ],
  templateUrl: './cursos-materias.component.html',
  styleUrls: ['./cursos-materias.component.scss']
})
export class CursosMateriasComponent implements OnInit {
  gestionTrimestral: string = '';
  gestionesDisponibles: string[] = ['2023-T1', '2023-T2', '2023-T3', '2024-T1', '2024-T2', '2024-T3', '2025-T1'];

  cursosMaterias: CursoMateria[] = [];

  constructor(
    private cursoService: CursoMateriaService,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.gestionTrimestral = params['gestion'] || this.gestionesDisponibles[0];
      this.cargarCursosMaterias();
    });
  }

  cargarCursosMaterias(): void {
    this.cursoService.getCursosMaterias(this.gestionTrimestral)
      .subscribe({
        next: (lista) => {
          this.cursosMaterias = lista;
        },
        error: (err) => {
          console.error('Error al obtener cursos-materias:', err);
        }
      });
  }

  cambiarGestion(nuevaGestion: string): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { gestion: nuevaGestion },
      queryParamsHandling: 'merge'
    });
  }

  onGestionChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.cambiarGestion(selectElement.value);
  }

  seleccionarCurso(curso: CursoMateria): void {
    const usuarioId = this.authService.getUserId();

    this.http.get<{ profesor_id: number }>(
      `${environment.apiUrl}/profesor/por-usuario/?usuario_id=${usuarioId}`
    ).subscribe({
      next: (respuesta) => {
        const profesorId = respuesta.profesor_id;

        this.router.navigate(['/profesor/estudiantes-clase'], {
          queryParams: {
            gestion_academica_trimestral: this.gestionTrimestral,
            curso_id: curso.curso_id,
            profesor_id: profesorId,
            materia_id: curso.materia_id
          }
        });
      },
      error: (err) => {
        console.error('Error al obtener el profesor_id desde usuario_id:', err);
      }
    });
  }
}
