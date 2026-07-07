import { Component } from '@angular/core';
import { SnippetsPostForm } from '../../components/snippets/snippets-post-form/snippets-post-form';

@Component({
  selector: 'app-snippets-post-pages',
  imports: [SnippetsPostForm],
  templateUrl: './snippets-post-pages.html',
  styleUrl: './snippets-post-pages.scss',
})
export class SnippetsPostPages {}
