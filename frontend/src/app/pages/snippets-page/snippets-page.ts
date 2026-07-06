import { Component, OnInit, inject, signal } from '@angular/core';
import { Snippet, SnippetsService } from '../../services/snippets';
import { SnippetBox } from '../../components/snippets/snippet-box/snippet-box';

@Component({
  selector: 'app-snippets-page',
  imports: [SnippetBox],
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
}
