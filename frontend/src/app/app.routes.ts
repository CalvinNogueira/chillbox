import { Routes } from '@angular/router';
import { LoginPage } from './pages/login-page/login-page';
import { Dashboard } from './pages/dashboard/dashboard';
import { authGuard } from './guards/auth-guard';
import { SnippetsPage } from './pages/snippets-page/snippets-page';
import { SnippetsPostPages } from './pages/snippets-post-pages/snippets-post-pages';
import { FolderPages } from './pages/folder-pages/folder-pages';

export const routes: Routes = [
  { path: 'login', component: LoginPage },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'dashboard/snippets', component: SnippetsPage, canActivate: [authGuard] },
  { path: 'dashboard/folders', component: FolderPages, canActivate: [authGuard] },
  { path: 'dashboard/snippets-post', component: SnippetsPostPages, canActivate: [authGuard] },
];
