import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    // Check if user is authenticated
    if (this.authService.isLoggedIn()) {
      return true;
    }

    // User is not authenticated, redirect to login
    console.log('Access denied. Redirecting to login...');
    return this.router.createUrlTree(['/auth/login']);
  }
}
