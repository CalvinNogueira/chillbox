import { Component } from '@angular/core';
import { NavigationLink } from '../navigation-link/navigation-link';
import { ChillboxLogo } from '../chillbox-logo/chillbox-logo';

@Component({
  selector: 'app-navigation-bar',
  imports: [NavigationLink, ChillboxLogo],
  templateUrl: './navigation-bar.html',
  styleUrl: './navigation-bar.scss',
})
export class NavigationBar {}
