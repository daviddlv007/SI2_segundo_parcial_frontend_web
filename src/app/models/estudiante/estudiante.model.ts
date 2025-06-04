// src/app/models/estudiante/estudiante.model.ts

export interface Estudiante {
  id?: number;               // Asignado por el backend al crear o actualizar
  fecha_nacimiento: string;  // Formato ISO (YYYY-MM-DD)
  genero: string;
  nombre_padre: string;
  nombre_madre: string;
  ci_tutor: string;
  direccion: string;
  telefono: string;

  // Relaciones (solo IDs)
  usuario: number; // ID del usuario en la tabla Usuario
  curso: number;   // ID del curso en la tabla Curso

  // Campos auxiliares para mostrar en la UI
  usuarioNombre?: string; // Se completará en el componente a partir de UsuarioService
  cursoNombre?: string;   // Opcional: si se desea mostrar el nombre del curso, se completaría a partir de CursoService
}
