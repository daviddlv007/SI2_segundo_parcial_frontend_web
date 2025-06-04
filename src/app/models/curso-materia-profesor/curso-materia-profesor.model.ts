// src/app/models/curso-materia-profesor/curso-materia-profesor.model.ts

export interface CursoMateriaProfesor {
  id?: number;              // Asignado por el backend al crear o actualizar
  dia: string;
  bloque_1_inicio: string;  // Formato “HH:MM:SS”
  bloque_1_fin: string;
  bloque_2_inicio: string;
  bloque_2_fin: string;

  // Relaciones (solo IDs que envía el backend)
  curso: number;     // ID de Curso
  materia: number;   // ID de Materia
  profesor: number;  // ID de Profesor

  // Campos auxiliares para mostrar en la UI
  cursoNombre?: string;     // “Nombre + paralelo” obtenido desde CursoService
  materiaNombre?: string;   // “Nombre” obtenido desde MateriaService
  profesorNombre?: string;  // “Nombre de usuario” obtenido desde UsuarioService vía ProfesorService
}
