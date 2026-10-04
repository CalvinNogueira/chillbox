import { Component, input, inject } from '@angular/core';
import { Folder } from '../../../services/folders';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-folder-box',
  templateUrl: './folder-box.html',
  styleUrl: './folder-box.scss',
})
export class FolderBox {
  folder = input.required<Folder>();
  private router = inject(Router);

  onClick() {
    // TODO : naviguer vers la page du folder
    this.router.navigate(['/dashboard/folder', this.folder().id]);
  }
}
