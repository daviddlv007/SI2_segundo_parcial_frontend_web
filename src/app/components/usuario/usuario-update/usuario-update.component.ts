// src/app/components/usuario/usuario-update.component.ts

import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../../services/usuario/usuario.service';
import { Usuario } from '../../../models/usuario/usuario.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-usuario-update',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './usuario-update.component.html',
  styleUrl: './usuario-update.component.scss'
})
export class UsuarioUpdateComponent implements OnInit {
  usuario: Usuario = { id: 0, nombre: '', correo: '', rol: '', password: '' };

  constructor(
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.usuarioService.obtenerUsuarioPorId(id).subscribe((data) => {
        this.usuario = data;
      });
    }
  }

  actualizarUsuario(): void {
    if (this.usuario.id) {
      this.usuarioService.actualizarUsuario(this.usuario.id, this.usuario).subscribe(() => {
        this.router.navigate(['admin/usuario']); // Redirige tras la actualización
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['admin/usuario']);
  }
}
