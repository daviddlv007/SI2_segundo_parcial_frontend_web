import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AutoService } from '../../../services/auto/auto.service';
import { PersonaService } from '../../../services/persona/persona.service';
import { Auto } from '../../../models/auto/auto.model';
import { Persona } from '../../../models/persona/persona.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auto-create',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './auto-create.component.html',
  styleUrls: ['./auto-create.component.scss']
})
export class AutoCreateComponent implements OnInit {
  // ahora persona es un number (id)
  auto: Auto = { marca: '', modelo: '', persona: 0 };
  personas: Persona[] = [];

  constructor(
    private autoService: AutoService,
    private personaService: PersonaService,
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

  crearAuto(): void {
    this.autoService.crearAuto(this.auto).subscribe(() => {
      this.router.navigate(['/auto']);
    });
  }

  cancelar(): void {
    this.router.navigate(['/auto']);
  }
}
