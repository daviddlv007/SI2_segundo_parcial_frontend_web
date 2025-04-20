// src/app/models/usuario/usuario.model.ts

export interface Usuario {
    id?: number;    // El ID es opcional porque solo se asigna al obtener o actualizar
    nombre: string;
    correo: string;
    rol: string;
    password: string;
  }
  