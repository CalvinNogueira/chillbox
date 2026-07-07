import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';

export interface Snippet {
  id: number;
  title: string;
  code: string;
  description?: string;
  language?: string;
  folders: string[]; // IRIs, ex: "/api/folders/1"
}

@Injectable({ providedIn: 'root' })
export class SnippetsService {
  private http = inject(HttpClient);

  getSnippets() {
    return this.http
      .get<{ member: Snippet[] }>('http://localhost:8000/api/snippets')
      .pipe(map((response) => response.member)); // on déballe l'enveloppe Hydra (member, fait par API Platform)
  }

  // folder : une IRI ("/api/folders/1") ou null pour un snippet hors dossier.
  // Pas de owner à envoyer : le backend le déduit du token (OwnerProcessor).
  addSnippet(
    title: string,
    code: string,
    description: string | null,
    folder: string | null,
    language: string | null = null,
  ) {
    return this.http.post<Snippet>(
      'http://localhost:8000/api/snippets',
      {
        title,
        code,
        description,
        language,
        // API Platform n'accepte que les tableaux d'IRI pour les relations. On envoie un tableau vide si pas de dossier.
        folders: folder ? [folder] : [],
      },
      // API Platform n'accepte que le JSON-LD en écriture, donc on précise.
      { headers: { 'Content-Type': 'application/ld+json' } },
    );
  }
}
