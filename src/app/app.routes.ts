import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'logic', pathMatch: 'full' },
  {
    path: 'logic',
    loadComponent: () => import('./features/logic/logic.component').then(m => m.LogicComponent)
  },
  {
    path: 'sets',
    loadComponent: () => import('./features/sets/sets.component').then(m => m.SetsComponent)
  },
  {
    path: 'graphs',
    loadComponent: () => import('./features/graphs/graphs.component').then(m => m.GraphsComponent)
  },
  { path: '**', redirectTo: 'logic' }
];