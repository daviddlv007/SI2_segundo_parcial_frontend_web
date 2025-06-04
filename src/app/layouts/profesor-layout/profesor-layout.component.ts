import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopbarComponent } from '../../components/topbar-profesor/topbar.component';
import { SidebarComponent } from '../../components/sidebar-profesor/sidebar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-profesor-layout',
  standalone: true,
  imports: [CommonModule, TopbarComponent, SidebarComponent, RouterOutlet],
  templateUrl: './profesor-layout.component.html',
  styleUrls: ['./profesor-layout.component.scss']
})
export class ProfesorLayoutComponent {
  sidebarVisible = true;

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }
}
