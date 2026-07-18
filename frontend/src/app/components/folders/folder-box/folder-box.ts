import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { Folder } from '../../../services/folders';

@Component({
  selector: 'app-folder-box',
  templateUrl: './folder-box.html',
  styleUrl: './folder-box.scss',
})
export class FolderBox {
  private router = inject(Router);

  folder = input.required<Folder>();

  onClick() {
    this.router.navigate(['/dashboard/folders', this.folder().id]);
  }
}
