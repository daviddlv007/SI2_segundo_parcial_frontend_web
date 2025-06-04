import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleRedirectGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    const role = this.authService.getUserRole();

    if (role === 'admin') {
      this.router.navigate(['/admin']);
    } else if (role === 'profesor') {
      this.router.navigate(['/profesor']);
    } else {
      this.router.navigate(['/login']);
    }

    return false;
  }
}
