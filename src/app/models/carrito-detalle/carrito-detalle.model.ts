// src/app/models/carrito-detalle/carrito-detalle.model.ts

export interface CarritoDetalle {
    id?: number;
    cantidad: number;
    precio_unitario: string;
    carrito: number;
    producto: number;
    productoNombre?: string; // Campo opcional para mostrar en la UI
    productoPrecio?: string; // Campo opcional para mostrar en la UI
  }