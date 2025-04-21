import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  menus = [
    { title: 'Home', route: '/home', expanded: false, children: [] },
    { title: 'Usuarios', expanded: false, children: [
      { title: 'Usuarios', route: '/usuario' },
    ]},
    { title: 'Inventario', expanded: false, children: [
      { title: 'Productos', route: '/producto' },
      { title: 'Inventario', route: '/inventario' },
      { title: 'Categorias', route: '/categoria' }
    ]},
    { title: 'Ventas', expanded: false, children: [
      { title: 'Carritos', route: '/carrito-compra' },
      { title: 'Ventas', route: '/venta' },
      { title: 'Reportes', route: '/reporte' }
    ]},
    // { title: 'Modelos', expanded: false, children: [
    //   { title: 'Persona', route: '/persona' },
    //   { title: 'Auto', route: '/auto' },
    //   { title: 'Perro', route: '/perro' }
    // ]}
  ];

  toggleMenu(menu: any) {
    menu.expanded = !menu.expanded;
  }
}
