import { Component, inject, input, output } from '@angular/core';
import { SnippetsService } from '../../../services/snippets';

@Component({
  selector: 'app-snippet-delete-button',
  imports: [],
  templateUrl: './snippet-delete-button.html',
  styleUrl: './snippet-delete-button.scss',
})
export class SnippetDeleteButton {
  private snippetsService = inject(SnippetsService);

  // input = donnée fournie par le parent : <... [snippetId]="snippet().id" />
  // .required : oublier de la passer = erreur de compilation. C'est un signal → lecture this.snippetId()
  snippetId = input.required<number>();

  // output = événement écouté par le parent : <... (deleted)="onDeleted($event)" />
  // emit(valeur) déclenche l'événement, le parent reçoit la valeur dans $event
  deleted = output<number>();

  delete(): void {
    // ponytail: confirm() natif, à remplacer par une modale quand la DA existera
    if (!confirm('Supprimer ce snippet ?')) return;

    // emit dans le next : on ne prévient le parent qu'APRÈS confirmation de l'API.
    // Si le DELETE échoue, rien n'est émis → la carte reste affichée, ce qui est la vérité.
    this.snippetsService.deleteSnippet(this.snippetId()).subscribe({
      next: () => this.deleted.emit(this.snippetId()),
    });
  }
}
