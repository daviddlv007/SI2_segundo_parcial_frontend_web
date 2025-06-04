// src/app/models/profesor/profesor.model.ts

export interface Profesor {
  id?: number;               // Asignado por el backend al crear o actualizar
  especialidad: string;
  profesion: string;
  fecha_ingreso: string;     // Formato ISO (YYYY-MM-DD)
  tipo_contrato: string;
  ci: string;
  direccion: string;
  telefono: string;

  // Relación (solo ID)
  usuario: number; // ID del usuario en la tabla Usuario

  // Campo auxiliar para mostrar en la UI
  usuarioNombre?: string; // Se completará en el componente a partir de UsuarioService
}
