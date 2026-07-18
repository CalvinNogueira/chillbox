import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Snippet, SnippetsService } from '../../services/snippets';
import { Hero } from '../../components/global/hero/hero';

@Component({
  selector: 'app-folder-snippets-page',
  imports: [Hero],
  templateUrl: './folder-snippets-page.html',
  styleUrl: './folder-snippets-page.scss',
})
export class FolderSnippetsPage implements OnInit {
  private route = inject(ActivatedRoute);
  private snippetsService = inject(SnippetsService);

  // l'id vient de l'URL (/dashboard/folders/:id), toujours une string → Number()
  folderId = Number(this.route.snapshot.paramMap.get('id'));

  snippets = signal<Snippet[]>([]);
  loading = signal(true);
  error = signal(false);

  ngOnInit(): void {
    this.snippetsService.getSnippetsFromFolder(this.folderId).subscribe({
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
