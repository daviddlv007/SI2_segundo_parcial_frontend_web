import { Component, OnInit } from '@angular/core';
import { EstudianteClaseService } from '../../services/estudiante-clase/estudiante-clase.service';
import { Estudiante } from '../../models/estudiante-clase/estudiante-clase.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ModalResumenGestionesEstudianteComponent } from '../modal-resumen-gestiones-estudiante/modal-resumen-gestiones-estudiante.component';

@Component({
  selector: 'app-estudiantes-clase',
  standalone: true,
  imports: [CommonModule,
    ModalResumenGestionesEstudianteComponent],
  templateUrl: './estudiantes-clase.component.html',
  styleUrls: ['./estudiantes-clase.component.scss']
})
export class EstudiantesClaseComponent implements OnInit {
  estudiantes: Estudiante[] = [];
  promedioRendimiento = 0;
  cantidadEstudiantes = 0;

  gestion = '';
  cursoId = 0;
  profesorId = 0;
  materiaId = 0;

  // Para el modal
  mostrarModal = false;
  estudianteSeleccionadoId: number | null = null;

  constructor(
    private estudianteService: EstudianteClaseService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.gestion = params['gestion_academica_trimestral'];
      this.cursoId = +params['curso_id'];
      this.profesorId = +params['profesor_id'];
      this.materiaId = +params['materia_id'];
      this.cargarEstudiantes();
    });
  }

cargarEstudiantes(): void {
  this.estudianteService.getEstudiantes({
    gestion_academica_trimestral: this.gestion,
    curso_id: this.cursoId,
    profesor_id: this.profesorId,
    materia_id: this.materiaId
  }).subscribe(data => {
    // Ordenar alfabéticamente por nombre
    this.estudiantes = data.sort((a, b) => a.nombre.localeCompare(b.nombre));

    this.cantidadEstudiantes = data.length;

    // Cambiar a rendimiento_academico_estimado
    const suma = data.reduce((acc, est) => acc + est.rendimiento_academico_estimado, 0);
    this.promedioRendimiento = data.length > 0 ? +(suma / data.length).toFixed(2) : 0;
  });
}


  irA(pagina: 'estudiante-evaluacion-legal' | 'estudiante-asistencia' | 'estudiante-participacion'): void {
    this.router.navigate([`/profesor/${pagina}`], {
      queryParams: {
        gestion_academica_trimestral: this.gestion,
        curso_id: this.cursoId,
        profesor_id: this.profesorId,
        materia_id: this.materiaId
      }
    });
  }

  descripcionRendimiento(valor: number): string {
    if (valor === 0) return 'En proceso';
    if (valor >= 95) return 'Excelente (Dominio sobresaliente)';
    if (valor >= 90) return 'Muy bueno (Dominio alto)';
    if (valor >= 80) return 'Bueno (Dominio satisfactorio)';
    if (valor >= 70) return 'Aceptable (Dominio básico)';
    if (valor >= 60) return 'Regular (Dificultades moderadas)';
    if (valor >= 50) return 'Insuficiente (Dificultades severas)';
    if (valor > 0) return 'Crítico (Requiere atención urgente)';
    return 'Valor inválido';
  }

  abrirModal(estudianteId: number): void {
    this.estudianteSeleccionadoId = estudianteId;
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.estudianteSeleccionadoId = null;
  }
}
