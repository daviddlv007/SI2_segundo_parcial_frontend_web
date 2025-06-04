import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EstudianteService } from '../../../services/estudiante/estudiante.service';
import { UsuarioService } from '../../../services/usuario/usuario.service';
import { CursoService } from '../../../services/curso/curso.service';
import { Usuario } from '../../../models/usuario/usuario.model';
import { Estudiante } from '../../../models/estudiante/estudiante.model';
import { Curso } from '../../../models/curso/curso.model';

@Component({
  selector: 'app-estudiante-update',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './estudiante-update.component.html',
  styleUrls: ['./estudiante-update.component.scss']
})
export class EstudianteUpdateComponent implements OnInit {
  estudiante: Estudiante = {
    usuario: null!,
    fecha_nacimiento: '',
    genero: '',
    curso: null!,
    nombre_padre: '',
    nombre_madre: '',
    ci_tutor: '',
    direccion: '',
    telefono: ''
  };

  terminoUsuario: string = '';
  listaUsuarios: Usuario[] = [];
  paginaActual: number = 1;
  totalUsuarios: number = 0;

  terminoCurso: string = '';
  listaCursos: Curso[] = [];
  paginaCursos: number = 1;
  totalCursos: number = 0;

  estudianteId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private estudianteService: EstudianteService,
    private usuarioService: UsuarioService,
    private cursoService: CursoService
  ) {}

  ngOnInit(): void {
    this.estudianteId = Number(this.route.snapshot.paramMap.get('id'));
    this.estudianteService.obtenerEstudiantePorId(this.estudianteId)
      .subscribe(est => {
        this.estudiante = est;

        // Rellenar campos de búsqueda para mostrar en inputs
        this.usuarioService.obtenerUsuarioPorId(est.usuario)
          .subscribe(u => this.terminoUsuario = u.nombre);

        this.cursoService.obtenerCursoPorId(est.curso)
          .subscribe(c => this.terminoCurso = `${c.nombre} - ${c.paralelo}`);
      }, err => {
        console.error('Error al cargar estudiante:', err);
      });
  }

  buscarUsuarios(): void {
    if (this.terminoUsuario.length < 2) {
      this.listaUsuarios = [];
      this.totalUsuarios = 0;
      return;
    }
    this.paginaActual = 1;
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

  actualizarEstudiante(): void {
    this.estudianteService.actualizarEstudiante(this.estudianteId, this.estudiante)
      .subscribe(() => {
        this.router.navigate(['admin/estudiante']);
      }, err => {
        console.error('Error al actualizar estudiante:', err);
      });
  }

  cancelar(): void {
    this.router.navigate(['admin/estudiante']);
  }
}
