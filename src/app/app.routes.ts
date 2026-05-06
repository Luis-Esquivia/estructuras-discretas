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
  {
    path: 'quiz',
    loadComponent: () => import('./features/quiz/quiz.component').then(m => m.QuizComponent)
  },
  {
    path: 'tutorial',
    loadComponent: () => import('./features/tutorial/tutorial.component').then(m => m.TutorialComponent)
  },
  { path: '**', redirectTo: 'logic' }
];