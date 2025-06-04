import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EstudianteService } from '../../../services/estudiante/estudiante.service';
import { UsuarioService } from '../../../services/usuario/usuario.service';
import { CursoService } from '../../../services/curso/curso.service';
import { Router } from '@angular/router';
import { Usuario } from '../../../models/usuario/usuario.model';
import { Estudiante } from '../../../models/estudiante/estudiante.model';
import { Curso } from '../../../models/curso/curso.model';

@Component({
  selector: 'app-estudiante-create',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './estudiante-create.component.html',
  styleUrls: ['./estudiante-create.component.scss']
})
export class EstudianteCreateComponent implements OnInit {
  estudiante: Estudiante = {
    usuario: null!,
    fecha_nacimiento: '',
    genero: '',
    curso: null!,
    nombre_padre: '',
    nombre_madre: '',
    ci_tutor: '',
    direccion: '',
    telefono: '',
  };

  terminoUsuario: string = '';
  listaUsuarios: Usuario[] = [];
  paginaActual: number = 1;
  totalUsuarios: number = 0;

  terminoCurso: string = '';
  listaCursos: Curso[] = [];
  paginaCursos: number = 1;
  totalCursos: number = 0;

  constructor(
    private usuarioService: UsuarioService,
    private estudianteService: EstudianteService,
    private cursoService: CursoService,
    private router: Router
  ) {}

  ngOnInit(): void {}

buscarUsuarios(): void {
  if (this.terminoUsuario.length < 2) {
    this.listaUsuarios = [];
    this.totalUsuarios = 0;
    return;
  }
  this.paginaActual = 1; // reiniciar página al hacer nueva búsqueda
  this.usuarioService.buscarUsuarios(this.terminoUsuario, this.paginaActual, 20)
    .subscribe(res => {
      this.listaUsuarios = res.results;
      this.totalUsuarios = res.count;
    }, err => {
      console.error('Error al buscar usuarios:', err);
    });
}


  seleccionarUsuario(u: Usuario): void {
    this.estudiante.usuario = u.id!;
    this.terminoUsuario = u.nombre;
    this.listaUsuarios = [];
  }

  buscarCursos(): void {
    if (this.terminoCurso.length < 2) {
      this.listaCursos = [];
      this.totalCursos = 0;
      return;
    }
    this.cursoService.buscarCursos(this.terminoCurso, this.paginaCursos, 20)
      .subscribe(res => {
        this.listaCursos = res.results;
        this.totalCursos = res.count;
      }, err => {
        console.error('Error al buscar cursos:', err);
      });
  }

  seleccionarCurso(c: Curso): void {
    this.estudiante.curso = c.id!;
    this.terminoCurso = `${c.nombre} - ${c.paralelo}`;
    this.listaCursos = [];
  }

  crearEstudiante(): void {
    this.estudianteService.crearEstudiante(this.estudiante)
      .subscribe(() => {
        this.router.navigate(['admin/estudiante']);
      }, err => {
        console.error('Error al crear estudiante:', err);
      });
  }

  cancelar(): void {
    this.router.navigate(['admin/estudiante']);
  }
}
