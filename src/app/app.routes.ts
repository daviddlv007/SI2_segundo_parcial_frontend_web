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

export const routes: Routes = [
  { 
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
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

      { path: '', redirectTo: 'usuario', pathMatch: 'full' }
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: 'usuario' }
];