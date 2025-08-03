import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: LandingComponent
  },
  {
    path: 'sign-in',
    loadComponent: () =>
      import('./auth/sign-in/sign-in.component').then(m => m.SignInComponent)
  },
  {
    path: 'sign-up',
    loadComponent: () =>
      import('./auth/sign-up/sign-up.component').then(m => m.SignUpComponent)
  },
  {
    path: 'dashboard',
    canActivate:[AuthGuard],
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
