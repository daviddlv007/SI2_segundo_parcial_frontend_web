import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  private readonly prefix = '/admin';

  private route(path: string): string {
    return `${this.prefix}${path}`;
  }

  menus = [
    { title: 'Dashboard', route: this.route('/home'), expanded: false, children: [] },
    {
      title: 'Usuarios', expanded: false, children: [
        { title: 'Usuarios', route: this.route('/usuario') },
        { title: 'Estudiantes', route: this.route('/estudiante') },
        { title: 'Profesores', route: this.route('/profesor') },
      ]
    },
    {
      title: 'Cursos', expanded: false, children: [
        { title: 'Cursos', route: this.route('/curso') },
        { title: 'Materias', route: this.route('/materia') },
        { title: 'Cronograma de Clases', route: this.route('/curso-materia-profesor') }
      ]
    },
    {
      title: 'Inscripciones', expanded: false, children: [
        { title: 'Inscripción Anual', route: this.route('/inscripcion') },
        { title: 'Inscripción Trimestral', route: this.route('/inscripcion-trimestre') }
      ]
    }
  ];

  toggleMenu(menu: any) {
    menu.expanded = !menu.expanded;
  }
}
