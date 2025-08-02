import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { AuthService } from '../../../../core/services/auth';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  isDarkMode = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.isDarkMode = this.document.documentElement.classList.contains('dark');
  }

  logout(): void {
    this.authService.logout();
  }

  toggleDarkMode(): void {
    const html = this.document.documentElement;

    if (this.isDarkMode) {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      this.isDarkMode = false;
    } else {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      this.isDarkMode = true;
    }
  }

  get userFullName(): string {
    if (this.currentUser) {
      return `${this.currentUser.firstName} ${this.currentUser.lastName}`;
    }
    return 'User';
  }

  get userInitials(): string {
    if (this.currentUser) {
      return `${this.currentUser.firstName.charAt(0)}${this.currentUser.lastName.charAt(0)}`;
    }
    return 'U';
  }
}
