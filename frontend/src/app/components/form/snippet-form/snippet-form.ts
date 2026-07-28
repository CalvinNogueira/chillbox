import { Component, effect, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Snippet, SnippetsService } from '../../../services/snippets';

@Component({
  selector: 'app-snippet-form',
  imports: [FormsModule],
  templateUrl: './snippet-form.html',
  styleUrl: './snippet-form.scss',
})
export class SnippetForm {
  private snippetsService = inject(SnippetsService);
  private router = inject(Router);

  // input OPTIONNEL (pas de .required) : c'est lui qui choisit le mode.
  // null (défaut) = création → POST ; un snippet fourni = édition → PATCH pré-rempli
  snippet = input<Snippet | null>(null);

  // en mode édition, le parent reçoit le snippet mis à jour renvoyé par l'API
  saved = output<Snippet>();

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

  constructor() {
    // pré-remplissage : si un snippet est fourni (mode édition), on copie ses
    // valeurs dans les champs du formulaire
    effect(() => {
      const s = this.snippet();
      if (!s) return;

      this.title = s.title;
      this.code = s.code;
      this.description = s.description ?? null;
      this.language = s.language ?? null;
      this.folder = s.folders[0] ?? null;
    });
  }

  submit() {
    const payload = {
      title: this.title,
      code: this.code,
      description: this.description,
      language: this.language,
      folders: this.folder ? [this.folder] : [],
    };

    const current = this.snippet();
    // même formulaire, deux destinations : PATCH si on édite, POST sinon
    const request = current
      ? this.snippetsService.patchSnippet(current.id, payload)
      : this.snippetsService.addSnippet(payload);

    request.subscribe({
      next: (snippet) => {
        this.saved.emit(snippet);
        // en création on quitte vers la liste ; en édition le parent décide (via saved)
        if (!current) this.router.navigate(['/dashboard/snippets']);
      },
      error: (error) => {
        console.error("Erreur lors de l'enregistrement du snippet :", error);
        // TODO : afficher un message d'erreur à l'utilisateur.
      },
    });
  }
}
