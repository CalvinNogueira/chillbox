import { Component, OnInit, inject, signal } from '@angular/core';
import { Folder, FolderServices } from '../../services/folders';
import { Hero } from '../../components/global/hero/hero';
import { FolderBox } from '../../components/folders/folder-box/folder-box';

@Component({
  selector: 'app-folder-pages',
  imports: [Hero, FolderBox],
  templateUrl: './folder-pages.html',
  styleUrl: './folder-pages.scss',
})
export class FolderPages implements OnInit {
  loading = signal<boolean>(true);
  Folders = signal<Folder[]>([]);
  error = signal<string>('');

  private FolderServices = inject(FolderServices);

  ngOnInit(): void {
    this.FolderServices.getFolder().subscribe({
      next: (Folders) => {
        this.Folders.set(Folders);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erreur lors du chargement des dossiers : ' + err.message);
        this.loading.set(false);
      },
    });
  }
}
