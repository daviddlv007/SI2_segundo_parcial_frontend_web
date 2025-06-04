// src/app/components/profesor/profesor-update/profesor-update.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProfesorService } from '../../../services/profesor/profesor.service';
import { UsuarioService } from '../../../services/usuario/usuario.service';
import { Usuario } from '../../../models/usuario/usuario.model';
import { Profesor } from '../../../models/profesor/profesor.model';

@Component({
  selector: 'app-profesor-update',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profesor-update.component.html',
  styleUrls: ['./profesor-update.component.scss']
})
export class ProfesorUpdateComponent implements OnInit {
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

  profesorId: number = 0;

  // Autocomplete para usuario
  terminoUsuario: string = '';
  listaUsuarios: Usuario[] = [];
  paginaUsuario: number = 1;
  totalUsuarios: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private profesorService: ProfesorService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.profesorId = Number(this.route.snapshot.paramMap.get('id'));
    this.profesorService.obtenerProfesorPorId(this.profesorId)
      .subscribe(p => {
        this.profesor = p;

        // Cargar el nombre de usuario en el input de autocompletar
        this.usuarioService.obtenerUsuarioPorId(p.usuario)
          .subscribe(u => {
            this.terminoUsuario = u.nombre;
          }, err => {
            console.error('Error al obtener usuario asociado:', err);
          });
      }, err => {
        console.error('Error al cargar profesor:', err);
      });
  }

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

  actualizarProfesor(): void {
    this.profesorService.actualizarProfesor(this.profesorId, this.profesor)
      .subscribe(() => {
        this.router.navigate(['admin/profesor']);
      }, err => {
        console.error('Error al actualizar profesor:', err);
      });
  }

  cancelar(): void {
    this.router.navigate(['admin/profesor']);
  }
}
