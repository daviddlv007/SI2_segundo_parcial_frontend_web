// src/app/components/usuario/usuario.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { UsuarioService } from '../../services/usuario/usuario.service';
import { Usuario } from '../../models/usuario/usuario.model';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss'],
})
export class UsuarioComponent {
  usuarios: Usuario[] = [];
  paginaActual: number = 1;
  elementosPorPagina: number = 10;
  totalUsuarios: number = 0;
  mostrarModal: boolean = false;
  usuarioAEliminarId: number | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit() {
    this.obtenerUsuarios();
  }

  obtenerUsuarios(): void {
    this.usuarioService.obtenerUsuarios({
      page: this.paginaActual,
      page_size: this.elementosPorPagina
    }).subscribe(response => {
      this.usuarios = response.results;
      this.totalUsuarios = response.count;
    });
  }

  get totalPaginas(): number {
    return Math.ceil(this.totalUsuarios / this.elementosPorPagina) || 1;
  }

  irACrearUsuario(): void {
    this.router.navigate(['admin/usuario-create']);
  }

  irAEditarUsuario(id: number): void {
    this.router.navigate([`admin/usuario-update/${id}`]);
  }

  confirmarEliminarUsuario(id: number): void {
    this.usuarioAEliminarId = id;
    this.mostrarModal = true;
  }

  eliminarUsuarioConfirmado(): void {
    if (this.usuarioAEliminarId !== null) {
      this.usuarioService.eliminarUsuario(this.usuarioAEliminarId)
        .subscribe(() => this.obtenerUsuarios());
      this.cerrarModal();
    }
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.usuarioAEliminarId = null;
  }

  cambiarPagina(direccion: 'previous' | 'next'): void {
    if (direccion === 'previous' && this.paginaActual > 1) {
      this.paginaActual--;
    } else if (direccion === 'next' && this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
    }
    this.obtenerUsuarios();
  }
}
