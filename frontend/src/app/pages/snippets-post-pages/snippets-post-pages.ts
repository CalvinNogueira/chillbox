import { Component } from '@angular/core';
import { SnippetForm } from '../../components/form/snippet-form/snippet-form';

@Component({
  selector: 'app-snippets-post-pages',
  imports: [SnippetForm],
  templateUrl: './snippets-post-pages.html',
  styleUrl: './snippets-post-pages.scss',
})
export class SnippetsPostPages {}
