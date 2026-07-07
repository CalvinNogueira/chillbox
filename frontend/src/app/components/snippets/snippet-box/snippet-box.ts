import { Component, effect, inject, input, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { codeToHtml } from 'shiki';
import { Snippet } from '../../../services/snippets';

@Component({
  selector: 'app-snippet-box',
  imports: [],
  templateUrl: './snippet-box.html',
  styleUrl: './snippet-box.scss',
})
export class SnippetBox {
  private sanitizer = inject(DomSanitizer);

  snippet = input.required<Snippet>();

  // HTML colorié par shiki, prêt pour [innerHTML]. Null le temps du rendu (asynchrone).
  highlighted = signal<SafeHtml | null>(null);

  constructor() {
    // effect : relance la coloration si le snippet change
    effect(async () => {
      const { code, language } = this.snippet();
      const html = await codeToHtml(code, {
        theme: 'one-dark-pro',
        lang: language ?? 'text',
      }).catch(() => codeToHtml(code, { theme: 'one-dark-pro', lang: 'text' })); // langage inconnu → texte brut

      // sûr : shiki échappe lui-même le contenu du code, le HTML produit ne contient
      // que ses propres spans de coloration
      this.highlighted.set(this.sanitizer.bypassSecurityTrustHtml(html));
    });
  }
}
