import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login-form',
  imports: [FormsModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})
export class LoginForm {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  // signal : modifié dans un callback HTTP, sans signal l'affichage ne serait pas rafraîchi (zoneless)
  error = signal('');

  onSubmit(): void {
    this.error.set('');
    this.auth.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () => this.error.set('Email ou mot de passe incorrect'),
    });
  }
}
