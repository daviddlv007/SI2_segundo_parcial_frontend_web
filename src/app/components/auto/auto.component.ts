import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AutoService } from '../../services/auto/auto.service';
import { PersonaService } from '../../services/persona/persona.service';
import { Auto } from '../../models/auto/auto.model';
import { Persona } from '../../models/persona/persona.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FilterService } from '../../services/filter/filter.service';
import { PaginationService } from '../../services/pagination/pagination.service';

@Component({
  selector: 'app-auto',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './auto.component.html',
  styleUrls: ['./auto.component.scss'],
})
export class AutoComponent {
  autos: Auto[] = [];
  autosFiltrados: Auto[] = [];
  autosPaginados: Auto[] = [];
  textoBusqueda: string = '';
  paginaActual = 1;
  elementosPorPagina = 5;
  totalPaginas = 0;

  // Mapa para convertir personaId -> nombre
  private personaMap: Record<number, string> = {};

  mostrarModal = false;
  autoAEliminarId: number | null = null;

  constructor(
    private autoService: AutoService,
    private personaService: PersonaService,
    private router: Router,
    private filterService: FilterService,
    private paginationService: PaginationService
  ) {}

  ngOnInit() {
    this.cargarPersonasYAutos();
  }

  private cargarPersonasYAutos(): void {
    this.personaService.obtenerPersonas().subscribe((personas: Persona[]) => {
      // creamos mapa id->nombre
      personas.forEach(p => {
        if (p.id != null) this.personaMap[p.id] = p.nombre;
      });
      // luego cargamos los autos
      this.obtenerAutos();
    });
  }

  obtenerAutos(): void {
    this.autoService.obtenerAutos().subscribe((data: Auto[]) => {
      // añadimos personaNombre a cada auto
      this.autos = data.map(a => ({
        ...a,
        personaNombre: this.personaMap[a.persona] ?? '–'
      }));
      this.autosFiltrados = [...this.autos];
      this.calcularPaginacion();
    });
  }

  eliminarAuto(id: number): void {
    this.autoService.eliminarAuto(id).subscribe(() => this.obtenerAutos());
  }

  irACrearAuto(): void {
    this.router.navigate(['/auto-create']);
  }

  irAEditarAuto(id: number): void {
    this.router.navigate([`/auto-update/${id}`]);
  }

  confirmarEliminarAuto(id: number): void {
    this.autoAEliminarId = id;
    this.mostrarModal = true;
  }

  eliminarAutoConfirmado(): void {
    if (this.autoAEliminarId != null) {
      this.eliminarAuto(this.autoAEliminarId);
      this.cerrarModal();
    }
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.autoAEliminarId = null;
  }

  filtrarAutos(): void {
    this.autosFiltrados = this.filterService.filtrar(this.autos, this.textoBusqueda);
    this.paginaActual = 1;
    this.calcularPaginacion();
  }

  calcularPaginacion(): void {
    const paginacion = this.paginationService.paginate(
      this.autosFiltrados,
      this.paginaActual,
      this.elementosPorPagina
    );
    this.totalPaginas = paginacion.totalPages;
    this.autosPaginados = paginacion.paginatedData;
  }

  cambiarPagina(direccion: string): void {
    this.paginaActual = this.paginationService.changePage(
      this.paginaActual,
      direccion as 'previous' | 'next',
      this.totalPaginas
    );
    this.actualizarAutosPaginados();
  }

  actualizarAutosPaginados(): void {
    const paginacion = this.paginationService.paginate(
      this.autosFiltrados,
      this.paginaActual,
      this.elementosPorPagina
    );
    this.autosPaginados = paginacion.paginatedData;
  }
}
