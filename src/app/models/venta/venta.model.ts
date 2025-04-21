// src/app/models/venta/venta.model.ts

export interface Venta {
    id?: number;             // Opcional: solo existe tras crear/actualizar
    fecha?: string;           // La fecha la asigna el backend
    total: string;
    metodo_pago: string;
    usuario: number;         // Guardamos solo el ID del usuario
    carrito: number;         // Guardamos solo el ID del carrito
    usuarioNombre?: string;  // Campo opcional para mostrar en la UI 
}
  