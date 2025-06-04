// src/app/components/profesor/profesor-create/profesor-create.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ProfesorService } from '../../../services/profesor/profesor.service';
import { UsuarioService } from '../../../services/usuario/usuario.service';
import { Usuario } from '../../../models/usuario/usuario.model';
import { Profesor } from '../../../models/profesor/profesor.model';

@Component({
  selector: 'app-profesor-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profesor-create.component.html',
  styleUrls: ['./profesor-create.component.scss']
})
export class ProfesorCreateComponent implements OnInit {
  profesor: Profesor = {
    especialidad: '',
    profesion: '',
    fecha_ingreso: '',
    tipo_contrato: '',
    ci: '',
    direccion: '',
    telefono: '',
    usuario: 0
  };

  // Autocomplete para usuario
  terminoUsuario: string = '';
  listaUsuarios: Usuario[] = [];
  paginaUsuario: number = 1;
  totalUsuarios: number = 0;

  constructor(
    private profesorService: ProfesorService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  // Busca usuarios cuando el término supera 2 caracteres
  buscarUsuarios(): void {
    if (this.terminoUsuario.length < 2) {
      this.listaUsuarios = [];
      this.totalUsuarios = 0;
      return;
    }
    this.paginaUsuario = 1;
    this.usuarioService.buscarUsuarios(this.terminoUsuario, this.paginaUsuario, 20)
      .subscribe(res => {
        this.listaUsuarios = res.results;
        this.totalUsuarios = res.count;
      }, err => {
        console.error('Error al buscar usuarios:', err);
      });
  }

  // Asigna el usuario seleccionado y limpia la lista
  seleccionarUsuario(u: Usuario): void {
    this.profesor.usuario = u.id!;
    this.terminoUsuario = u.nombre;
    this.listaUsuarios = [];
  }

  crearProfesor(): void {
    this.profesorService.crearProfesor(this.profesor)
      .subscribe(() => {
        this.router.navigate(['admin/profesor']);
      }, err => {
        console.error('Error al crear profesor:', err);
      });
  }

  cancelar(): void {
    this.router.navigate(['admin/profesor']);
  }
}
