// src/app/models/inventario/inventario.model.ts

export interface Inventario {
    id?: number;               // Opcional: solo existe tras crear/actualizar
    cantidad: number;
    umbral_alerta: number;
    producto: number;          // Relacionado con el ID del producto
    productoNombre?: string;   // Campo opcional para mostrar en la UI
  }
  