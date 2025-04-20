// src/app/models/persona-perro/persona-perro.model.ts

export interface PersonaPerro {
  id?: number;
  persona: number;      // antes era personaId?
  perro: number;        // antes era perroId?
  personaNombre?: string; // añadimos para el UI
}
