// src/app/models/estudiante-asistencia/estudiante-asistencia.model.ts

export interface EstudianteBasico {
  id: number;
  nombre: string;
}

export interface Asistencia {
  id: number;
  fecha: string;           // p. ej. "2025-06-02"
  tipo: string;            // p. ej. "P", "F", "T", etc.
  observaciones: string;
  inscripcion_trimestre: number;
}

export interface EstudianteAsistencia {
  estudiante: EstudianteBasico;
  asistencias: Asistencia[];
}
