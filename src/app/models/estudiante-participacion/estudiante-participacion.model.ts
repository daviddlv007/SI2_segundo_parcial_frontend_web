// src/app/models/estudiante-participacion/estudiante-participacion.model.ts

export interface EstudianteBasico {
  id: number;
  nombre: string;
}

export interface Participacion {
  id: number;
  participo: boolean;
  fecha: string;           // "YYYY-MM-DD"
  inscripcion_trimestre: number;
}

export interface EstudianteParticipacion {
  estudiante: EstudianteBasico;
  participaciones: Participacion[];
}
