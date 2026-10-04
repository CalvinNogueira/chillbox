import { Routes } from '@angular/router';
import { LoginPage } from './pages/login-page/login-page';
import { Dashboard } from './pages/dashboard/dashboard';
import { authGuard } from './guards/auth-guard';
import { SnippetsPage } from './pages/snippets-page/snippets-page';
import { SnippetsPostPages } from './pages/snippets-post-pages/snippets-post-pages';
import { FolderPages } from './pages/folder-pages/folder-pages';
import { FolderId } from './pages/folder-id/folder-id';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginPage },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'dashboard/snippets', component: SnippetsPage, canActivate: [authGuard] },
  { path: 'dashboard/folders', component: FolderPages, canActivate: [authGuard] },
  { path: 'dashboard/snippets-post', component: SnippetsPostPages, canActivate: [authGuard] },
  { path: 'dashboard/folder/:id', component: FolderId, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];
