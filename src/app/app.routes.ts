import { Routes } from '@angular/router';
import { CategoriaComponent } from './components/categoria/categoria.component';
import { CategoriaCreateComponent } from './components/categoria/categoria-create/categoria-create.component';
import { CategoriaUpdateComponent } from './components/categoria/categoria-update/categoria-update.component';
import { ProductoComponent } from './components/producto/producto.component';
import { ProductoCreateComponent } from './components/producto/producto-create/producto-create.component';
import { ProductoUpdateComponent } from './components/producto/producto-update/producto-update.component';
import { InventarioComponent } from './components/inventario/inventario.component';
import { InventarioCreateComponent } from './components/inventario/inventario-create/inventario-create.component';
import { InventarioUpdateComponent } from './components/inventario/inventario-update/inventario-update.component';
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
import { CarritoCompraComponent } from './components/carrito-compra/carrito-compra.component';
import { VentaComponent } from './components/venta/venta.component';
// import { VentaCreateComponent } from './components/venta/venta-create/venta-create.component';
// import { VentaUpdateComponent } from './components/venta/venta-update/venta-update.component';




export const routes: Routes = [
  { 
    path: '',
    component: MainLayoutComponent,
    // Desactivación de autenticación
    // canActivate: [AuthGuard],
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

      { path: 'categoria', component: CategoriaComponent },
      { path: 'categoria-create', component: CategoriaCreateComponent },
      { path: 'categoria-update/:id', component: CategoriaUpdateComponent },

      { path: 'producto', component: ProductoComponent },
      { path: 'producto-create', component: ProductoCreateComponent },
      { path: 'producto-update/:id', component: ProductoUpdateComponent },

      { path: 'inventario', component: InventarioComponent },
      { path: 'inventario-create', component: InventarioCreateComponent },
      { path: 'inventario-update/:id', component: InventarioUpdateComponent },

      { path: 'carrito-compra', component: CarritoCompraComponent },

      { path: 'venta', component: VentaComponent },
      // { path: 'venta-create', component: VentaCreateComponent },
      // { path: 'venta-update/:id', component: VentaUpdateComponent },
      

      { path: '', redirectTo: 'usuario', pathMatch: 'full' }
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: 'usuario' }
];
