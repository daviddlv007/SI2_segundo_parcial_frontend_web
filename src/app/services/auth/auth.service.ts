import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'auth_token';
  private refreshTokenKey = 'refresh_token';
  private userIdKey = 'user_id';
  private userRoleKey = 'user_role';
  // (Opcional) Si quieres guardar el correo ingresado:
  private userEmailKey = 'user_email';

  constructor(private http: HttpClient, private router: Router) {}

  /**
   * Hace login enviando { correo, password }.
   * Espera la respuesta { access, refresh, id, rol }.
   */
  login(correo: string, contrasena: string): Observable<any> {
    const body = {
      correo: correo,
      password: contrasena
    };

    return this.http.post(`${environment.apiUrl}/token/`, body).pipe(
      tap((response: any) => {
        // response.access es el token de acceso
        this.setToken(response.access);
        this.setRefreshToken(response.refresh);
        this.setUserId(response.id);
        this.setUserRole(response.rol);
        this.setUserEmail(correo);
      })
    );
  }

  /**
   * Logout en backend y limpieza en localStorage.
   */
  logout(): Observable<null> {
    this.clearAuthData();
    this.router.navigate(['/login']);
    return of(null); // Retorna un Observable por compatibilidad
  }

  /**
   * Devuelve true si hay un token de acceso guardado.
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Obtiene el token de acceso del localStorage.
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Obtiene el refresh token (si lo necesitas para refresh automático).
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  /**
   * Obtiene el id de usuario (convertido a número).
   */
  getUserId(): number | null {
    const userId = localStorage.getItem(this.userIdKey);
    return userId ? parseInt(userId, 10) : null;
  }

  /**
   * Obtiene el rol de usuario.
   */
  getUserRole(): string | null {
    return localStorage.getItem(this.userRoleKey);
  }

  /**
   * (Opcional) Obtener el correo que usó para iniciar sesión.
   */
  getUserEmail(): string | null {
    return localStorage.getItem(this.userEmailKey);
  }

  /**
   * Guarda el token de acceso en localStorage.
   */
  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  /**
   * Guarda el refresh token en localStorage.
   */
  private setRefreshToken(refresh: string): void {
    localStorage.setItem(this.refreshTokenKey, refresh);
  }

  /**
   * Guarda el id del usuario en localStorage.
   */
  private setUserId(id: number): void {
    localStorage.setItem(this.userIdKey, id.toString());
  }

  /**
   * Guarda el rol del usuario en localStorage.
   */
  private setUserRole(rol: string): void {
    localStorage.setItem(this.userRoleKey, rol);
  }

  /**
   * (Opcional) Guarda el correo en localStorage.
   */
  private setUserEmail(correo: string): void {
    localStorage.setItem(this.userEmailKey, correo);
  }

  /**
   * Elimina todos los datos de autenticación del localStorage.
   */
  private clearAuthData(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.userIdKey);
    localStorage.removeItem(this.userRoleKey);
    localStorage.removeItem(this.userEmailKey);
  }
}
