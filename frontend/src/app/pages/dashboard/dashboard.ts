import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { Hero } from '../../components/global/hero/hero';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, Hero],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private auth = inject(AuthService);
}
