import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { PersonaService } from '../../services/persona/persona.service';
import { Persona } from '../../models/persona/persona.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PaginationService } from '../../services/pagination/pagination.service';

@Component({
  selector: 'app-persona',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.scss'],
})
export class PersonaComponent {
  personas: Persona[] = [];
  personasPaginadas: Persona[] = [];
  paginaActual: number = 1;
  elementosPorPagina: number = 10;
  totalPaginas: number = 0;
  mostrarModal: boolean = false;  // Control del modal
  personaAEliminarId: number | null = null;  // ID de la persona a eliminar

  constructor(
    private personaService: PersonaService,
    private router: Router,
    private paginationService: PaginationService
  ) {}

  ngOnInit() {
    this.obtenerPersonas();
  }

  obtenerPersonas(): void {
    this.personaService.obtenerPersonas().subscribe((data) => {
      this.personas = data;
      this.calcularPaginacion();
    });
  }

  eliminarPersona(id: number): void {
    this.personaService.eliminarPersona(id).subscribe(() => {
      this.obtenerPersonas();
    });
  }

  irACrearPersona(): void {
    this.router.navigate(['/persona-create']);
  }

  irAEditarPersona(id: number): void {
    this.router.navigate([`/persona-update/${id}`]);
  }

  confirmarEliminarPersona(id: number): void {
    this.personaAEliminarId = id;
    this.mostrarModal = true;
  }

  eliminarPersonaConfirmada(): void {
    if (this.personaAEliminarId !== null) {
      this.eliminarPersona(this.personaAEliminarId);
      this.cerrarModal();
    }
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.personaAEliminarId = null;
  }

  calcularPaginacion(): void {
    const paginacion = this.paginationService.paginate(
      this.personas,
      this.paginaActual,
      this.elementosPorPagina
    );
    this.totalPaginas = paginacion.totalPages;
    this.personasPaginadas = paginacion.paginatedData;
  }

  cambiarPagina(direccion: string): void {
    this.paginaActual = this.paginationService.changePage(
      this.paginaActual,
      direccion as 'previous' | 'next',
      this.totalPaginas
    );
    this.actualizarPersonasPaginadas();
  }

  actualizarPersonasPaginadas(): void {
    const paginacion = this.paginationService.paginate(
      this.personas,
      this.paginaActual,
      this.elementosPorPagina
    );
    this.personasPaginadas = paginacion.paginatedData;
  }
}
