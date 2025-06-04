import { Routes } from '@angular/router';
import { PersonaComponent } from './components/persona/persona.component';
import { PersonaCreateComponent } from './components/persona/persona-create/persona-create.component';
import { PersonaUpdateComponent } from './components/persona/persona-update/persona-update.component';
import { AutoComponent } from './components/auto/auto.component';
import { AutoCreateComponent } from './components/auto/auto-create/auto-create.component';
import { AutoUpdateComponent } from './components/auto/auto-update/auto-update.component';
import { PerroComponent } from './components/perro/perro.component';
import { PerroCreateComponent } from './components/perro/perro-create/perro-create.component';
import { PerroUpdateComponent } from './components/perro/perro-update/perro-update.component';
import { LoginComponent } from './components/auth/login/login.component';
import { AuthGuard } from './guards/auth/auth.guard';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { UsuarioCreateComponent } from './components/usuario/usuario-create/usuario-create.component';
import { UsuarioUpdateComponent } from './components/usuario/usuario-update/usuario-update.component';
//import { HomeComponent } from './components/home/home.component';
import { ProfesorLayoutComponent } from './layouts/profesor-layout/profesor-layout.component';
import { RoleRedirectGuard } from './guards/role-redirect/role-redirect.guard';
import { CursoComponent } from './components/curso/curso.component';
import { MateriaComponent } from './components/materia/materia.component';
import { EstudianteComponent } from './components/estudiante/estudiante.component';
import { ProfesorComponent } from './components/profesor/profesor.component';
import { CursoMateriaProfesorComponent } from './components/curso-materia-profesor/curso-materia-profesor.component';
import { InscripcionComponent } from './components/inscripcion/inscripcion.component';
import { InscripcionTrimestreComponent } from './components/inscripcion-trimestre/inscripcion-trimestre.component';

import { CursosMateriasComponent } from './components/curso-materia/cursos-materias.component';
import { EstudiantesClaseComponent } from './components/estudiante-clase/estudiantes-clase.component';
import { EstudianteAsistenciaComponent } from './components/estudiante-asistencia/estudiante-asistencia.component';
import { RegistrarAsistenciaEstudianteComponent } from './components/registrar-asistencia-estudiante/registrar-asistencia-estudiante.component';
import { EstudianteEvaluacionLegalComponent } from './components/estudiante-evaluacion-legal/estudiante-evaluacion-legal.component';
import { RegistrarEvaluacionLegalEstudianteComponent } from './components/registrar-evaluacion-legal-estudiante/registrar-evaluacion-legal-estudiante.component';
import { EstudianteParticipacionComponent } from './components/estudiante-participacion/estudiante-participacion.component';
import { RegistrarParticipacionEstudianteComponent } from './components/registrar-participacion-estudiante/registrar-participacion-estudiante.component';
import { EstudianteCreateComponent } from './components/estudiante/estudiante-create/estudiante-create.component';
import { EstudianteUpdateComponent } from './components/estudiante/estudiante-update/estudiante-update.component';
import { MateriaCreateComponent } from './components/materia/materia-create/materia-create.component';
import { MateriaUpdateComponent } from './components/materia/materia-update/materia-update.component';
import { ProfesorCreateComponent } from './components/profesor/profesor-create/profesor-create.component';
import { ProfesorUpdateComponent } from './components/profesor/profesor-update/profesor-update.component';


export const routes: Routes = [
  // Ruta de login
  { path: 'login', component: LoginComponent },

  // Ruta raíz: redirecciona según el rol
  { path: '', canActivate: [RoleRedirectGuard], component: LoginComponent },

  // Layout para administrador
  {
    path: 'admin',
    component: MainLayoutComponent,
    children: [
      { path: 'usuario', component: UsuarioComponent },
      { path: '', redirectTo: 'usuario', pathMatch: 'full' },
      { path: 'persona', component: PersonaComponent },
      { path: 'persona-create', component: PersonaCreateComponent },
      { path: 'persona-update/:id', component: PersonaUpdateComponent },

      { path: 'auto', component: AutoComponent },
      { path: 'auto-create', component: AutoCreateComponent },
      { path: 'auto-update/:id', component: AutoUpdateComponent },

      { path: 'perro', component: PerroComponent },
      { path: 'perro-create', component: PerroCreateComponent },
      { path: 'perro-update/:id', component: PerroUpdateComponent },

      { path: 'usuario', component: UsuarioComponent },
      { path: 'usuario-create', component: UsuarioCreateComponent },
      { path: 'usuario-update/:id', component: UsuarioUpdateComponent },

      { path: 'curso', component: CursoComponent },

      { path: 'materia', component: MateriaComponent },
   
      { path: 'estudiante', component: EstudianteComponent },
      
      { path: 'profesor', component: ProfesorComponent },
    
      { path: 'curso-materia-profesor', component: CursoMateriaProfesorComponent },

      { path: 'inscripcion', component: InscripcionComponent },

      { path: 'inscripcion-trimestre', component: InscripcionTrimestreComponent },

      { path: 'estudiante-create', component: EstudianteCreateComponent },
      { path: 'estudiante-update/:id', component: EstudianteUpdateComponent },
      
      { path: 'materia-create', component: MateriaCreateComponent },
      { path: 'materia-update/:id', component: MateriaUpdateComponent },

      { path: 'profesor-create', component: ProfesorCreateComponent },
      { path: 'profesor-update/:id', component: ProfesorUpdateComponent }

    ]
  },

  // Layout para profesor
  {
    path: 'profesor',
    component: ProfesorLayoutComponent,
    children: [
      // Aquí puedes agregar otras rutas específicas del profesor
      { path: '', component: CursosMateriasComponent }, // puedes cambiar esto
      { path: 'persona', component: PersonaComponent },

      { path: 'curso-materia', component: CursosMateriasComponent },
      { path: 'estudiantes-clase', component: EstudiantesClaseComponent },
      { path: 'estudiante-asistencia', component: EstudianteAsistenciaComponent },
      { path: 'registrar-asistencia-estudiante', component: RegistrarAsistenciaEstudianteComponent },
      { path: 'estudiante-evaluacion-legal', component: EstudianteEvaluacionLegalComponent },
      { path: 'registrar-evaluacion-legal-estudiante', component: RegistrarEvaluacionLegalEstudianteComponent },
      { path: 'estudiante-participacion', component: EstudianteParticipacionComponent },
      { path: 'registrar-participacion-estudiante', component: RegistrarParticipacionEstudianteComponent }
      
    ]
  },

  { path: '**', redirectTo: '' }
];

