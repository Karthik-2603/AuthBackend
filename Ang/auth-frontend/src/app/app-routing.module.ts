import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
//   {
//     path: '',
//     loadChildren: () =>
//       import('./landing/landing.module').then(m => m.LandingModule)
//   },
//   {
//     path: 'sign-in',
//     loadChildren: () =>
//       import('./auth/sign-in/sign-in.module').then(m => m.SignInModule)
//   },
//   {
//     path: 'sign-up',
//     loadChildren: () =>
//       import('./auth/sign-up/sign-up.module').then(m => m.SignUpModule)
//   },
//   {
//     path: 'dashboard',
//     canActivate: [AuthGuard],
//     loadChildren: () =>
//       import('./dashboard/dashboard.module').then(m => m.DashboardModule)
//   }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}