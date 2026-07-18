import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';
import { Snippet } from './snippets';

export interface Folder {
  id: number;
  title: string;
  description?: string | null;
  owner: string; // IRI, ex: "/api/users/4"
  snippets: string[]; // IRIs, ex: "/api/snippets/28"
}

export type FolderPaylod = Omit<Folder, 'id'>;

@Injectable({ providedIn: 'root' })
export class FolderServices {
  // TODO : get,add,patch,delete FOLDER

  private http = inject(HttpClient);

  getFolder() {
    return this.http
      .get<{ member: Folder[] }>('http://localhost:8000/api/folders')
      .pipe(map((response) => response.member));
  }

  addFolder(paylod: FolderPaylod) {
    return this.http.post<Folder>('http://localhost:8000/api/folders', paylod, {
      headers: { 'Content-Type': 'application/ld+json' },
    });
  }

  patchFolder(id: number, changes: Partial<FolderPaylod>) {
    return this.http.patch<Folder>(`http://localhost:8000/api/folders/${id}`, changes, {
      headers: { 'Content-Type': 'application/merge-patch+json' },
    });
  }

  deleteFolder(id: number) {
    return this.http.delete(`http://localhost:8000/api/folders/${id}`);
  }
}
