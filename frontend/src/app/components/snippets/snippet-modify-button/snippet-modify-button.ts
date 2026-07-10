import { Component, input, output, signal } from '@angular/core';
import { Snippet } from '../../../services/snippets';
import { SnippetForm } from '../../form/snippet-form/snippet-form';

@Component({
  selector: 'app-snippet-modify-button',
  imports: [SnippetForm],
  templateUrl: './snippet-modify-button.html',
  styleUrl: './snippet-modify-button.scss',
})
export class SnippetModifyButton {
  // input = donnée fournie par le parent ([snippet]="...", obligatoire, lue via this.snippet())
  snippet = input.required<Snippet>();

  // output = événement remonté au parent ((modified)="...") ; transporte le snippet
  // mis à jour renvoyé par l'API, reçu côté parent dans $event
  modified = output<Snippet>();

  // bouton ou formulaire ? Le PATCH lui-même est fait par SnippetForm
  editing = signal(false);

  onSaved(snippet: Snippet): void {
    this.editing.set(false);
    this.modified.emit(snippet);
  }
}
