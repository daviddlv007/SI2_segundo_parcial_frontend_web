// src/app/models/inscripcion/inscripcion.model.ts

export interface Inscripcion {
  id?: number;                       // Asignado por el backend al crear o actualizar
  gestion_academica_anual: string;
  nota_evaluacion_legal: string;     // Se recibe como string (p. ej. "12.50")
  nota_asistencia: string;
  nota_participacion: string;
  rendimiento_academico_real: string;
  rendimiento_academico_estimado: string;

  // Relaciones (solo IDs que envía el backend)
  curso: number;       // ID de Curso
  estudiante: number;  // ID de Estudiante
  profesor: number | null;   // ID de Profesor (puede ser null)
  materia: number;     // ID de Materia

  // Campos auxiliares para mostrar en la UI
  cursoNombre?: string;       // “Nombre + paralelo” obtenido desde CursoService
  materiaNombre?: string;     // “Nombre” obtenido desde MateriaService
  profesorNombre?: string;    // “Nombre de usuario” obtenido desde UsuarioService vía ProfesorService
  estudianteNombre?: string;  // “Nombre de usuario” obtenido desde UsuarioService vía EstudianteService
}
