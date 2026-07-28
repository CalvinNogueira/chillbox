import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth';

// Passe sur CHAQUE requête HTTP sortante :
// 1. ajoute le token en header Authorization
// 2. si le serveur répond 401 (token expiré/invalide), déconnecte et renvoie au login
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);

  if (auth.token) {
    // les requêtes sont immuables : on travaille sur un clone enrichi
    req = req.clone({ setHeaders: { Authorization: `Bearer ${auth.token}` } });
  }

  return next(req).pipe(
    catchError((err) => {
      if (
        err instanceof HttpErrorResponse &&
        err.status === 401 &&
        !req.url.endsWith('/api/login')
      ) {
        auth.logout(); // supprime le token ET redirige vers /login
      }
      return throwError(() => err);
    }),
  );
};
