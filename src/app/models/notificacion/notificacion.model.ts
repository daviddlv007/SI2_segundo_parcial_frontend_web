export interface Notificacion {
    id?: number;             // Opcional, solo existe luego de crearla
    mensaje: string;
    tipo: 'stock_bajo' | string;   // Puedes tipar más si hay otros tipos
    estado: 'enviado' | 'pendiente' | string;
    usuario: number;         // Solo el ID del usuario
    usuarioNombre?: string;  // Opcional para mostrar en la UI
  }
  