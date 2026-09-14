import { Component, inject, signal } from '@angular/core';
import { NavigationLink } from '../navigation-link/navigation-link';
import { ChillboxLogo } from '../chillbox-logo/chillbox-logo';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-navigation-bar',
  imports: [NavigationLink, ChillboxLogo, RouterLink],
  templateUrl: './navigation-bar.html',
  styleUrl: './navigation-bar.scss',
})
export class NavigationBar {
  private authService = inject(AuthService);
  private router = inject(Router);

  isLogged = signal(this.authService.isLoggedIn());
}
