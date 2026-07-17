import { Component, input } from '@angular/core';
import { Folder } from '../../../services/folders';

@Component({
  selector: 'app-folder-box',
  templateUrl: './folder-box.html',
  styleUrl: './folder-box.scss',
})
export class FolderBox {
  folder = input.required<Folder>();

  onClick() {
    // TODO : naviguer vers la page du folder
  }
}
