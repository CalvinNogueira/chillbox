import { Component, OnInit, inject, signal } from '@angular/core';
import { Snippet, SnippetsService } from '../../services/snippets';
import { SnippetBox } from '../../components/snippets/snippet-box/snippet-box';
import { Hero } from '../../components/global/hero/hero';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-snippets-page',
  imports: [SnippetBox, Hero, RouterLink],
  templateUrl: './snippets-page.html',
  styleUrl: './snippets-page.scss',
})
export class SnippetsPage implements OnInit {
  private snippetsService = inject(SnippetsService);

  // signals : quand leur valeur change via .set(), Angular sait qu'il doit redessiner
  // (indispensable en zoneless, le mode par défaut d'Angular 21)
  snippets = signal<Snippet[]>([]);
  loading = signal(true);
  error = signal(false);

  ngOnInit(): void {
    this.snippetsService.getSnippets().subscribe({
      next: (snippets) => {
        this.snippets.set(snippets);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  // .update() : nouvelle valeur calculée à partir de l'ancienne (l'API a déjà été
  // mise à jour par les boutons, on synchronise juste l'affichage)
  onDeleted(id: number): void {
    this.snippets.update((list) => list.filter((s) => s.id !== id));
  }

  onModified(updated: Snippet): void {
    this.snippets.update((list) => list.map((s) => (s.id === updated.id ? updated : s)));
  }
}
