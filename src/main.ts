import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app/app';
import { GuestGuard } from './app/core/guards/guest-guard';
import { AuthGuard } from './app/core/guards/auth-guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full' as const,
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./app/features/auth/pages/auth-layout/auth-layout').then(
        (c) => c.AuthLayoutComponent,
      ),
    canActivate: [GuestGuard],
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full' as const,
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./app/features/auth/pages/login/login').then(
            (c) => c.LoginComponent,
          ),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./app/features/auth/pages/register/register').then(
            (c) => c.RegisterComponent,
          ),
      },
    ],
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./app/features/dashboard/pages/dashboard/dashboard').then(
        (c) => c.DashboardComponent,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: '/dashboard',
  },
];

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes), importProvidersFrom(ReactiveFormsModule)],
}).catch((err) => {
  console.error('Bootstrap error:', err);
  document.body.innerHTML = `
    <div style="padding: 20px; background: red; color: white; font-family: Arial, sans-serif;">
      <h1>Application Error</h1>
      <p>Failed to start the application. Please check the console for details.</p>
      <pre style="background: rgba(0,0,0,0.2); padding: 10px; border-radius: 4px; overflow: auto;">${err}</pre>
    </div>
  `;
});
