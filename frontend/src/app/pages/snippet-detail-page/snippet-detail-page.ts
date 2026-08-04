import { Component, OnInit, inject, signal } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Snippet, SnippetsService } from '../../services/snippets';
import { SnippetBox } from '../../components/snippets/snippet-box/snippet-box';
import { Hero } from '../../components/global/hero/hero';

@Component({
  selector: 'app-snippet-detail-page',
  imports: [SnippetBox, Hero],
  templateUrl: './snippet-detail-page.html',
  styleUrl: './snippet-detail-page.scss',
})
export class SnippetDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private snippetsService = inject(SnippetsService);

  // null tant que le snippet n'est pas chargé (ou en erreur)
  snippet = signal<Snippet | null>(null);
  loading = signal(true);
  error = signal(false);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.snippetsService.getSnippet(id).subscribe({
      next: (snippet) => {
        this.snippet.set(snippet);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  onDeleted(): void {
    // le snippet n'existe plus : retour à la page d'où on vient
    this.location.back();
  }

  onModified(updated: Snippet): void {
    this.snippet.set(updated);
  }
}
