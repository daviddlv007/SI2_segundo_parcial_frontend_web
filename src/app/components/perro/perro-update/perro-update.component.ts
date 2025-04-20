import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PerroService } from '../../../services/perro/perro.service';
import { PersonaService } from '../../../services/persona/persona.service';
import { PersonaPerroService } from '../../../services/persona-perro/persona-perro.service';
import { Perro } from '../../../models/perro/perro.model';
import { Persona } from '../../../models/persona/persona.model';
import { PersonaPerro } from '../../../models/persona-perro/persona-perro.model';
import { forkJoin, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-perro-update',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './perro-update.component.html',
  styleUrls: ['./perro-update.component.scss'],
})
export class PerroUpdateComponent implements OnInit {
  perro: Perro = { id: 0, nombre: '', raza: '' };
  personas: Persona[] = [];
  selectedPersonas: Persona[] = [];
  personaSeleccionada: Persona | null = null;

  constructor(
    private perroService: PerroService,
    private personaService: PersonaService,
    private personaPerroService: PersonaPerroService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      // Cargar perro y relaciones en paralelo
      forkJoin([
        this.perroService.obtenerPerroPorId(id),
        this.personaService.obtenerPersonas(),
        this.personaPerroService.obtenerPersonaPerros()
      ]).pipe(
        switchMap(([perro, personas, relaciones]) => {
          this.perro = perro;
          this.personas = personas;
          
          // Filtrar relaciones para este perro
          const relacionesPerro = relaciones.filter(r => r.perro === perro.id);
          
          // Obtener IDs de personas vinculadas
          const personasIds = relacionesPerro.map(r => r.persona);
          
          // Filtrar personas ya vinculadas
          this.selectedPersonas = personas.filter(p => personasIds.includes(p.id!));
          this.personas = personas.filter(p => !personasIds.includes(p.id!));
          
          return forkJoin(
            personasIds.map(personaId => 
              this.personaService.obtenerPersonaPorId(personaId)
            )
          );
        })
      ).subscribe(personasVinculadas => {
        this.selectedPersonas = personasVinculadas;
      });
    }
  }

  addPersonaToSelected(persona: Persona | null): void {
    if (persona) {
      this.selectedPersonas.push(persona);
      this.personas = this.personas.filter(p => p.id !== persona.id);
      this.personaSeleccionada = null;
    }
  }

  removePersonaFromSelected(persona: Persona): void {
    this.selectedPersonas = this.selectedPersonas.filter(p => p.id !== persona.id);
    this.personas.push(persona);
  }

  actualizarPerro(): void {
    if (this.perro.id) {
      // Primero actualizar el perro
      this.perroService.actualizarPerro(this.perro.id, this.perro).subscribe({
        next: (updatedPerro) => {
          // Luego manejar las relaciones
          this.actualizarRelaciones(updatedPerro.id!);
        },
        error: (err) => console.error('Error al actualizar perro:', err)
      });
      this.router.navigate(['/perro']);
    }
  }

  private actualizarRelaciones(perroId: number): void {
    this.personaPerroService.obtenerPersonaPerros().subscribe({
      next: (relacionesExistentes) => {
        // Filtrar relaciones existentes para este perro
        const relacionesPerro = relacionesExistentes.filter(r => r.perro === perroId);
        
        // IDs de personas actualmente vinculadas
        const idsPersonasActuales = relacionesPerro.map(r => r.persona);
        
        // IDs de personas que deberían estar vinculadas
        const idsPersonasDeseadas = this.selectedPersonas.map(p => p.id!);
        
        // Relaciones a eliminar (están en la BD pero no en selectedPersonas)
        const relacionesAEliminar = relacionesPerro.filter(
          r => !idsPersonasDeseadas.includes(r.persona)
        );
        
        // Personas a agregar (están en selectedPersonas pero no en la BD)
        const personasAAgregar = this.selectedPersonas.filter(
          p => !idsPersonasActuales.includes(p.id!)
        );
        
        // Eliminar relaciones no deseadas
        const eliminaciones = relacionesAEliminar.map(relacion => 
          this.personaPerroService.eliminarPersonaPerro(relacion.id!)
        );
        
        // Crear nuevas relaciones
        const creaciones = personasAAgregar.map(persona => {
          const nuevaRelacion: PersonaPerro = {
            persona: persona.id!,
            perro: perroId
          };
          return this.personaPerroService.crearPersonaPerro(nuevaRelacion);
        });
        
        // Ejecutar todas las operaciones
        forkJoin([...eliminaciones, ...creaciones]).subscribe({
          next: () => this.router.navigate(['/perro']),
          error: (err) => console.error('Error al actualizar relaciones:', err)
        });
      },
      error: (err) => console.error('Error al obtener relaciones:', err)
    });
  }

  cancelar(): void {
    this.router.navigate(['/perro']);
  }
}