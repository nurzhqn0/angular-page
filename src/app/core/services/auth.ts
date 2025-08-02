import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from './storage';
import { User } from '../models/user.model';
import {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  StoredUserData,
} from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly AUTH_KEY = 'auth_user';
  private readonly USERS_KEY = 'registered_users';

  private currentUser = signal<User | null>(null);
  private isAuthenticated = signal<boolean>(false);
  private isLoading = signal<boolean>(false);

  constructor(
    private router: Router,
    private storageService: StorageService,
  ) {
    this.initializeAuth();
  }

  get user() {
    return this.currentUser.asReadonly();
  }

  get authenticated() {
    return this.isAuthenticated.asReadonly();
  }

  get loading() {
    return this.isLoading.asReadonly();
  }

  private initializeAuth(): void {
    const storedAuth = this.storageService.getItem<StoredUserData>(
      this.AUTH_KEY,
    );
    if (storedAuth && storedAuth.user) {
      this.currentUser.set(storedAuth.user);
      this.isAuthenticated.set(true);
    }
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    this.isLoading.set(true);

    return new Observable((observer) => {
      setTimeout(() => {
        const users =
          this.storageService.getItem<StoredUserData[]>(this.USERS_KEY) || [];
        const user = users.find(
          (u: StoredUserData) =>
            u.user.email === credentials.email &&
            u.password === credentials.password,
        );

        if (user) {
          this.currentUser.set(user.user);
          this.isAuthenticated.set(true);

          this.storageService.setItem(this.AUTH_KEY, user);

          const response: AuthResponse = {
            success: true,
            message: 'Login successful',
            user: user.user,
            token: user.token,
          };

          this.isLoading.set(false);
          observer.next(response);
          observer.complete();
        } else {
          const response: AuthResponse = {
            success: false,
            message: 'Invalid email or password',
          };

          this.isLoading.set(false);
          observer.next(response);
          observer.complete();
        }
      }, 1000);
    });
  }

  register(registerData: RegisterData): Observable<AuthResponse> {
    this.isLoading.set(true);

    return new Observable((observer) => {
      setTimeout(() => {
        const users =
          this.storageService.getItem<StoredUserData[]>(this.USERS_KEY) || [];

        const existingUser = users.find(
          (u: StoredUserData) => u.user.email === registerData.email,
        );
        if (existingUser) {
          const response: AuthResponse = {
            success: false,
            message: 'User with this email already exists',
          };

          this.isLoading.set(false);
          observer.next(response);
          observer.complete();
          return;
        }

        const newUser: User = {
          id: this.generateId(),
          email: registerData.email,
          firstName: registerData.firstName,
          lastName: registerData.lastName,
          role: 'user',
          createdAt: new Date().toISOString(),
        };

        const token = this.generateToken();

        const userData: StoredUserData = {
          user: newUser,
          token: token,
          password: registerData.password,
        };

        users.push(userData);
        this.storageService.setItem(this.USERS_KEY, users);

        this.currentUser.set(newUser);
        this.isAuthenticated.set(true);
        this.storageService.setItem(this.AUTH_KEY, userData);

        const response: AuthResponse = {
          success: true,
          message: 'Registration successful',
          user: newUser,
          token: token,
        };

        this.isLoading.set(false);
        observer.next(response);
        observer.complete();
      }, 1500);
    });
  }

  logout(): void {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.storageService.removeItem(this.AUTH_KEY);
    this.router.navigate(['/auth/login']);
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  getCurrentUser(): User | null {
    return this.currentUser();
  }

  clearAllAuthData(): void {
    this.storageService.removeItem(this.AUTH_KEY);
    this.storageService.removeItem(this.USERS_KEY);
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private generateToken(): string {
    return (
      'token_' + Date.now().toString(36) + Math.random().toString(36).substr(2)
    );
  }
}
