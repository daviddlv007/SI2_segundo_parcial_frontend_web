// src/app/models/producto/producto.model.ts

export interface Producto {
    id?: number;           // Opcional: solo existe tras crear/actualizar
    nombre: string;
    descripcion: string;
    precio: string;
    url_imagen: string;
    categoria: number;     // Relacionado con el ID de la categoría
    categoriaNombre?: string; // Campo opcional para mostrar en la UI
  }
  