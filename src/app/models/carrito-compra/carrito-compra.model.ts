// src/app/models/carrito-compra/carrito-compra.model.ts

export interface CarritoCompra {
    id?: number;
    estado: string;
    usuario: number;
    usuarioNombre?: string; // Campo opcional para mostrar en la UI
  }