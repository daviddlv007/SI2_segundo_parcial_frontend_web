import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { PerroService } from '../../services/perro/perro.service';
import { PersonaService } from '../../services/persona/persona.service';
import { PersonaPerroService } from '../../services/persona-perro/persona-perro.service';

import { Perro } from '../../models/perro/perro.model';
import { Persona } from '../../models/persona/persona.model';
import { PersonaPerro } from '../../models/persona-perro/persona-perro.model';

// Quitar importación de FilterService
import { PaginationService } from '../../services/pagination/pagination.service';

@Component({
  selector: 'app-perro',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './perro.component.html',
  styleUrls: ['./perro.component.scss'],
})
export class PerroComponent implements OnInit {
  perros: Perro[] = [];
  perrosPaginados: Perro[] = [];
  personaPerros: PersonaPerro[] = [];
  // Eliminar textoBusqueda y perrosFiltrados
  paginaActual = 1;
  elementosPorPagina = 5;
  totalPaginas = 0;

  mostrarModalEliminar = false;
  perroAEliminarId: number | null = null;

  mostrarModalPersonas = false;

  private personaMap: Record<number, string> = {};

  constructor(
    private perroService: PerroService,
    private personaService: PersonaService,
    private personaPerroService: PersonaPerroService,
    private router: Router,
    // Eliminar FilterService de constructor
    private paginationService: PaginationService
  ) {}

  ngOnInit() {
    this.cargarPersonas();
    this.obtenerPerros();
  }

  private cargarPersonas(): void {
    this.personaService.obtenerPersonas().subscribe(personas => {
      personas.forEach(p => {
        if (p.id != null) this.personaMap[p.id] = p.nombre;
      });
    });
  }

  obtenerPerros(): void {
    this.perroService.obtenerPerros().subscribe(data => {
      this.perros = data;
      // En vez de perrosFiltrados, paginar perros directamente
      this.calcularPaginacion();
    });
  }

  verPersonasPorPerro(id: number): void {
    this.personaPerroService.obtenerPersonaPerros().subscribe(data => {
      this.personaPerros = data
        .filter(pp => pp.perro === id)
        .map(pp => ({
          ...pp,
          personaNombre: this.personaMap[pp.persona] ?? '–'
        }));
      this.mostrarModalPersonas = true;
    });
  }

  cerrarModalPersonas(): void {
    this.mostrarModalPersonas = false;
    this.personaPerros = [];
  }

  confirmarEliminarPerro(id: number): void {
    this.perroAEliminarId = id;
    this.mostrarModalEliminar = true;
  }

  eliminarPerroConfirmado(): void {
    if (this.perroAEliminarId != null) {
      this.perroService.eliminarPerro(this.perroAEliminarId)
        .subscribe(() => {
          this.obtenerPerros();
          this.cerrarModalEliminar();
        });
    }
  }

  cerrarModalEliminar(): void {
    this.mostrarModalEliminar = false;
    this.perroAEliminarId = null;
  }

  irACrearPerro(): void {
    this.router.navigate(['/perro-create']);
  }

  irAEditarPerro(id: number): void {
    this.router.navigate([`/perro-update/${id}`]);
  }

  // Eliminar método filtrarPerros()

  calcularPaginacion(): void {
    const pag = this.paginationService.paginate(
      this.perros, this.paginaActual, this.elementosPorPagina
    );
    this.totalPaginas = pag.totalPages;
    this.perrosPaginados = pag.paginatedData;
  }

  cambiarPagina(dir: string): void {
    this.paginaActual = this.paginationService.changePage(
      this.paginaActual, dir as 'previous'|'next', this.totalPaginas
    );
    this.calcularPaginacion();
  }
}
