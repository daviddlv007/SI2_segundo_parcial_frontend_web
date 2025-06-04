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
    { title: 'Dashboard', route: '/profesor/curso-materia', expanded: false, children: [] },
    { title: 'Cursos', expanded: false, children: [
      { title: 'Cursos', route: '/profesor/curso-materia' },
    ]}
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
