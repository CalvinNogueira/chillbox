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
      .pipe(map((response) => response.member)); // on déballe l'enveloppe Hydra
  }
}
