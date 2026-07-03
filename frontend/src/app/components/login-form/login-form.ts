import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  imports: [FormsModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})
export class LoginForm {
  email = '';
  password = '';

  onSubmit(): void {
    // ponytail: juste un log pour l'instant, le vrai appel API viendra avec le service d'auth
    console.log('login', this.email, this.password);
  }
}
