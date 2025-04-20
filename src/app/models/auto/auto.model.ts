// src/app/models/auto/auto.model.ts

export interface Auto {
  id?: number;           // Opcional: solo existe tras crear/actualizar
  marca: string;
  modelo: string;
  persona: number;       // Ahora solo guardamos el ID de la persona
  personaNombre?: string; // Campo opcional para mostrar en la UI
}
