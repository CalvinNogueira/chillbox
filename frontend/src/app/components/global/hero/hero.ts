import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  private auth = inject(AuthService);

  logout() {
    this.auth.logout();
  }

  // toSignal : s'abonne à l'Observable et expose le résultat en signal.
  // Vaut undefined tant que la réponse HTTP n'est pas arrivée.
  user = toSignal(this.auth.getMe());
}
