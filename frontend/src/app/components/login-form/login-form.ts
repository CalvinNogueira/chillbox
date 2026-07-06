import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login-form',
  imports: [FormsModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})
export class LoginForm {
  private auth = inject(AuthService);

  email = '';
  password = '';
  error = '';
  connected = false;

  onSubmit(): void {
    this.error = '';
    this.auth.login(this.email, this.password).subscribe({
      // ponytail: pas encore de page d'accueil, on affiche juste "connecté" ;
      // remplacer par router.navigate() quand la page snippets existera
      next: () => (this.connected = true),
      error: () => (this.error = 'Email ou mot de passe incorrect'),
    });
  }
}
