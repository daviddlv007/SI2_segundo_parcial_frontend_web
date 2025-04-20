// src/app/components/perro/perro-create/perro-create.component.ts

import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PerroService } from '../../../services/perro/perro.service';
import { PersonaPerroService } from '../../../services/persona-perro/persona-perro.service';
import { PersonaService } from '../../../services/persona/persona.service';
import { Perro } from '../../../models/perro/perro.model';
import { PersonaPerro } from '../../../models/persona-perro/persona-perro.model';
import { Persona } from '../../../models/persona/persona.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perro-create',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './perro-create.component.html',
  styleUrls: ['./perro-create.component.scss'],
})
export class PerroCreateComponent implements OnInit {
  perro: Perro = { nombre: '', raza: '' };
  personas: Persona[] = [];
  selectedPersonas: Persona[] = [];
  personaSeleccionada: Persona | null = null;

  constructor(
    private perroService: PerroService,
    private personaService: PersonaService,
    private personaPerroService: PersonaPerroService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarPersonas();
  }

  cargarPersonas(): void {
    this.personaService.obtenerPersonas().subscribe(personas => {
      this.personas = personas;
    });
  }

  addPersonaToSelected(persona: Persona | null): void {
    if (persona && persona.id != null) {
      this.selectedPersonas.push(persona);
      this.personas = this.personas.filter(p => p.id !== persona.id);
    }
    this.personaSeleccionada = null;
  }

  removePersonaFromSelected(persona: Persona): void {
    this.selectedPersonas = this.selectedPersonas.filter(p => p.id !== persona.id);
    this.personas.push(persona);
  }

  crearPerro(): void {
    this.perroService.crearPerro(this.perro).subscribe(nuevoPerro => {
      // ahora personaPerro.persona y .perro son solo IDs
      this.selectedPersonas.forEach(persona => {
        if (nuevoPerro.id != null && persona.id != null) {
          const personaPerro: PersonaPerro = {
            persona: persona.id,
            perro: nuevoPerro.id
          };
          this.personaPerroService.crearPersonaPerro(personaPerro)
            .subscribe(); // el endpoint ya incluye “/”
        }
      });
      this.router.navigate(['/perro']);
    });
  }

  cancelar(): void {
    this.router.navigate(['/perro']);
  }
}
