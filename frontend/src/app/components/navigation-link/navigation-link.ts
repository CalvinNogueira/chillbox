import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navigation-link',
  imports: [RouterLink],
  templateUrl: './navigation-link.html',
  styleUrl: './navigation-link.scss',
})
export class NavigationLink {
  linkString = input.required<string>();
  linkStringHref = input.required<string>();
}
