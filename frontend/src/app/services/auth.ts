import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  // ponytail: URL en dur, à sortir dans environment.ts quand on déploiera ailleurs qu'en local
  login(email: string, password: string) {
    return this.http
      .post<{ token: string }>('http://localhost:8000/api/login', { email, password })
      .pipe(tap(({ token }) => localStorage.setItem('jwt', token)));
  }

  getMe() {
    // pas de header à poser car l'authInterceptor ajoute le Bearer sur toutes les requêtes
    return this.http.get<{
      id: number;
      email: string;
      firstName: string | null;
      lastName: string | null;
    }>('http://localhost:8000/api/me');
  }

  get token(): string | null {
    return localStorage.getItem('jwt');
  }

  isLoggedIn(): boolean {
    return !!this.token;
  }

  logout(): void {
    localStorage.removeItem('jwt');
    this.router.navigate(['/login']);
  }
}
