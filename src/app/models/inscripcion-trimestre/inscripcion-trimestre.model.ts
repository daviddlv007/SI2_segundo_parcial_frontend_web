// src/app/models/inscripcion-trimestre/inscripcion-trimestre.model.ts

export interface InscripcionTrimestre {
  id?: number;                         // Asignado por el backend al crear o actualizar
  gestion_academica_trimestral: string;
  nota_evaluacion_legal: string;       // Se recibe como string, ej. "15.50"
  nota_asistencia: string;
  nota_participacion: string;
  rendimiento_academico_real: string;
  rendimiento_academico_estimado: string;

  // Relación (solo ID que envía el backend)
  inscripcion: number;                 // ID de la Inscripcion padre

  // Campos auxiliares para mostrar en la UI
  cursoNombre?: string;                // “Nombre + paralelo” obtenido desde CursoService vía Inscripcion
  materiaNombre?: string;              // “Nombre” obtenido desde MateriaService vía Inscripcion
  profesorNombre?: string;             // “Nombre de usuario” obtenido desde UsuarioService vía Inscripcion→Profesor
  estudianteNombre?: string;           // “Nombre de usuario” obtenido desde UsuarioService vía Inscripcion→Estudiante
}
