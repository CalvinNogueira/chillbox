import {Component} from '@angular/core';
import {NavigationLink} from './navigation-link/navigation-link';
import { NavigationBar } from './navigation-bar/navigation-bar';

@Component({
  selector: 'app-root',
  imports: [NavigationLink, NavigationBar],
  templateUrl: './app.html',
})
export class App {}
