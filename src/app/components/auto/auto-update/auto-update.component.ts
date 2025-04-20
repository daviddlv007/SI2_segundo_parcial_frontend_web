// src/app/components/auto/auto-update/auto-update.component.ts

import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AutoService } from '../../../services/auto/auto.service';
import { PersonaService } from '../../../services/persona/persona.service';
import { Auto } from '../../../models/auto/auto.model';
import { Persona } from '../../../models/persona/persona.model';

@Component({
  selector: 'app-auto-update',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './auto-update.component.html',
  styleUrls: ['./auto-update.component.scss']  // CORREGIDO
})
export class AutoUpdateComponent implements OnInit {
  // inicializamos persona como número
  auto: Auto = { marca: '', modelo: '', persona: 0 };
  personas: Persona[] = [];

  constructor(
    private autoService: AutoService,
    private personaService: PersonaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarPersonas();
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.autoService.obtenerAutoPorId(id).subscribe(autoBackend => {
        // autoBackend.persona es un número
        this.auto = autoBackend;
      });
    }
  }

  private cargarPersonas(): void {
    this.personaService.obtenerPersonas().subscribe(personas => {
      this.personas = personas;
    });
  }

  actualizarAuto(): void {
    if (!this.auto.id) return;
    this.autoService.actualizarAuto(this.auto.id, this.auto)
      .subscribe(() => this.router.navigate(['/auto']));
  }

  cancelar(): void {
    this.router.navigate(['/auto']);
  }
}
