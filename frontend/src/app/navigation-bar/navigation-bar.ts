import { Component } from '@angular/core';
import { NavigationLink } from '../navigation-link/navigation-link';

@Component({
  selector: 'app-navigation-bar',
  imports: [NavigationLink],
  templateUrl: './navigation-bar.html',
  styleUrl: './navigation-bar.scss',
})
export class NavigationBar {}
