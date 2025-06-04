// src/app/components/usuario/usuario-create.component.ts

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../../services/usuario/usuario.service';
import { Usuario } from '../../../models/usuario/usuario.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuario-create',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './usuario-create.component.html',
  styleUrl: './usuario-create.component.scss'
})
export class UsuarioCreateComponent {
    usuario: Usuario = { 
        nombre: '', 
        correo: '', 
        rol: '', 
        password: '' // <-- Campo agregado
      };
      
  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  crearUsuario(): void {
    this.usuarioService.crearUsuario(this.usuario).subscribe(() => {
      this.router.navigate(['/usuario']);
    });
  }

  cancelar(): void {
    this.router.navigate(['/usuario']);
  }
}
