import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationBar } from './components/navigation-bar/navigation-bar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavigationBar],
  templateUrl: './app.html',
})
export class App {}
