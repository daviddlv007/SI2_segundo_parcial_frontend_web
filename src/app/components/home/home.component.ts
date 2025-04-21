import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificacionService } from '../../services/notificacion/notificacion.service';
import { Notificacion } from '../../models/notificacion/notificacion.model';
import { UsuarioService } from '../../services/usuario/usuario.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  notificaciones: Notificacion[] = [];
  cargando = true;
  error: string | null = null;

  // Mapa de usuarios para mostrar nombres
  usuarioMap: Record<number, string> = {};

  constructor(
    private notificacionService: NotificacionService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarNotificaciones();
  }

  cargarUsuarios(): void {
    this.usuarioService.obtenerUsuarios().subscribe({
      next: (usuarios) => {
        usuarios.forEach(u => {
          if (u.id) this.usuarioMap[u.id] = u.nombre;
        });
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
      }
    });
  }

  cargarNotificaciones(): void {
    this.cargando = true;
    this.error = null;
    
    this.notificacionService.obtenerNotificaciones().subscribe({
      next: (notificaciones) => {
        this.notificaciones = notificaciones
        .sort((a, b) => (b.id ?? 0) - (a.id ?? 0)) // 👈 ordenar por id descendente
          .map(n => ({
            ...n,
            usuarioNombre: this.usuarioMap[n.usuario] || 'Usuario desconocido'
          }));
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar notificaciones:', err);
        this.error = 'Error al cargar las notificaciones';
        this.cargando = false;
      }
    });
  }
  

  getIconoTipo(tipo: string): string {
    switch(tipo) {
      case 'stock_bajo':
        return '⚠️'; // Icono de advertencia
      default:
        return 'ℹ️'; // Icono de información
    }
  }

  getClaseEstado(estado: string): string {
    switch(estado) {
      case 'pendiente':
        return 'estado-pendiente';
      case 'enviado':
        return 'estado-enviado';
      default:
        return 'estado-desconocido';
    }
  }
}