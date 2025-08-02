import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthLayoutComponent } from './pages/auth-layout/auth-layout';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { GuestGuard } from '../../core/guards/guest-guard';

const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [GuestGuard],
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
