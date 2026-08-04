import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';

// Un snippet tel que l'API le renvoie.
export interface Snippet {
  id: number;
  title: string;
  code: string;
  description?: string | null;
  language?: string | null;
  folders: string[]; // IRIs, ex: "/api/folders/1"
}

// Ce qu'on envoie à l'API : tout sauf ce que le serveur génère (id — et le owner,
// déduit du token par OwnerProcessor). Dérivé de Snippet : une seule source de vérité.
export type SnippetPayload = Omit<Snippet, 'id'>;

@Injectable({ providedIn: 'root' })
export class SnippetsService {
  private http = inject(HttpClient);

  getSnippets() {
    return this.http
      .get<{ member: Snippet[] }>('http://localhost:8000/api/snippets')
      .pipe(map((response) => response.member)); // on déballe l'enveloppe Hydra (member, fait par API Platform)
  }

  // un seul snippet : l'API renvoie l'objet directement, pas d'enveloppe { member }
  getSnippet(id: number) {
    return this.http.get<Snippet>(`http://localhost:8000/api/snippets/${id}`);
  }

  getSnippetsFromFolder(folderId: number) {
    return this.http
      .get<{
        member: Snippet[];
      }>(`http://localhost:8000/api/snippets?folders=/api/folders/${folderId}`)
      .pipe(map((response) => response.member));
  }

  addSnippet(payload: SnippetPayload) {
    return this.http.post<Snippet>('http://localhost:8000/api/snippets', payload, {
      // API Platform n'accepte que le JSON-LD en écriture, donc on précise.
      headers: { 'Content-Type': 'application/ld+json' },
    });
  }

  // Partial : on n'envoie que les champs à modifier, ex. { title: 'nouveau' }
  patchSnippet(id: number, changes: Partial<SnippetPayload>) {
    return this.http.patch<Snippet>(`http://localhost:8000/api/snippets/${id}`, changes, {
      //API Platform veut ce content-type précis
      headers: { 'Content-Type': 'application/merge-patch+json' },
    });
  }

  deleteSnippet(id: number) {
    return this.http.delete(`http://localhost:8000/api/snippets/${id}`);
  }
}
