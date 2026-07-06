import { Component, input } from '@angular/core';
import { Snippet } from '../../../services/snippets';

@Component({
  selector: 'app-snippet-box',
  imports: [],
  templateUrl: './snippet-box.html',
  styleUrl: './snippet-box.scss',
})
export class SnippetBox {
  // input = paramètre du composant, fourni par le parent : <app-snippet-box [snippet]="..." />
  // "required" : oublier de le passer = erreur de compilation
  snippet = input.required<Snippet>();
}
