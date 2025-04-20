// app.config.ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { routes } from './app.routes';
//import { AuthInterceptor } from './interceptors/auth/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(HttpClientModule),
    // Es neceario deshabilitar el interceptor de autenticacion para que funcione la API de Django
    // Posibles causas:
    // El interceptor no podía obtener un token (porque no existía en el frontend):
    // El backend no esperaba un token en ciertas rutas (ej: /api/personas/):
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: AuthInterceptor,
    //   multi: true
    // }
  ]
};