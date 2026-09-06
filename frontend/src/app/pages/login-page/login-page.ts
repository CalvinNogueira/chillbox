import { Component } from '@angular/core';
import { LoginForm } from '../../components/form/login-form/login-form';
import { AuthService } from '../../services/auth';
import { inject } from '@angular/core/primitives/di';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  imports: [LoginForm],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {
  private AuthService = inject(AuthService);
  private router = inject(Router);

  // Sécurité au cas ou un user met volontairement /login...
  ngOnInit(): void {
    const isLogged = this.AuthService.isLoggedIn();
    if (isLogged) {
      this.router.navigate(['/']);
    }
  }
}
