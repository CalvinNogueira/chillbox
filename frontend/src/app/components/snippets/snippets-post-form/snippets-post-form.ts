import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SnippetsService } from '../../../services/snippets';

@Component({
  selector: 'app-snippets-post-form',
  imports: [FormsModule],
  templateUrl: './snippets-post-form.html',
  styleUrl: './snippets-post-form.scss',
})
export class SnippetsPostForm {
  private snippetsService = inject(SnippetsService);
  private router = inject(Router);

  // ids shiki, alignés sur les fixtures
  readonly languages = [
    'bash',
    'c',
    'cpp',
    'csharp',
    'css',
    'go',
    'html',
    'java',
    'javascript',
    'json',
    'kotlin',
    'php',
    'python',
    'ruby',
    'rust',
    'sql',
    'swift',
    'twig',
    'typescript',
    'yaml',
  ];

  title = '';
  code = '';
  description: string | null = null;
  folder: string | null = null;
  language: string | null = null;

  submit() {
    this.snippetsService
      .addSnippet({
        title: this.title,
        code: this.code,
        description: this.description,
        language: this.language,
        folders: this.folder ? [this.folder] : [],
      })
      .subscribe({
        next: () => this.router.navigate(['/dashboard/snippets']),
        error: (error) => {
          console.error("Erreur lors de l'ajout du snippet :", error);
          // TODO : afficher un message d'erreur à l'utilisateur.
        },
      });
  }
}
