import { Component, OnInit, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { initFlowbite } from 'flowbite';
import { StoredUserData } from './core/models/auth.model';
import { User } from './core/models/user.model';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class AppComponent implements OnInit {
  private readonly USERS_KEY = 'registered_users';

  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngOnInit(): void {
    console.log('🚀 Angular App initialized successfully');

    this.initializeTheme();
    this.initializeDemoUser();

    setTimeout(() => {
      try {
        initFlowbite();
        console.log('✅ Flowbite initialized');
      } catch (error) {
        console.warn('⚠️ Flowbite initialization failed:', error);
      }
    }, 100);
  }

  private initializeTheme(): void {
    try {
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches;
      const shouldUseDark =
        savedTheme === 'dark' || (!savedTheme && prefersDark);

      if (shouldUseDark) {
        this.document.documentElement.classList.add('dark');
        console.log('🌙 Dark mode enabled');
      } else {
        this.document.documentElement.classList.remove('dark');
        console.log('☀️ Light mode enabled');
      }
    } catch (error) {
      console.warn('⚠️ Theme initialization failed:', error);
    }
  }

  private initializeDemoUser(): void {
    try {
      const demoEmail = 'demo@example.com';
      const demoPassword = 'demo123';

      const existingUsers: StoredUserData[] = JSON.parse(
        localStorage.getItem(this.USERS_KEY) || '[]',
      );

      const demoUserExists = existingUsers.some(
        (userData: StoredUserData) => userData.user.email === demoEmail,
      );

      if (!demoUserExists) {
        const demoUser: User = {
          id: 'demo_' + Date.now().toString(36),
          email: demoEmail,
          firstName: 'Demo',
          lastName: 'User',
          role: 'user',
          createdAt: new Date().toISOString(),
        };

        const demoToken = 'demo_token_' + Date.now().toString(36);

        const demoUserData: StoredUserData = {
          user: demoUser,
          token: demoToken,
          password: demoPassword,
        };
        existingUsers.push(demoUserData);

        localStorage.setItem(this.USERS_KEY, JSON.stringify(existingUsers));

        console.log('✅ Demo user added to registered_users');
        console.log('📧 Email:', demoEmail);
        console.log('🔑 Password:', demoPassword);
      } else {
        console.log('📋 Demo user already exists in registered_users');
      }
    } catch (error) {
      console.warn('⚠️ Demo user initialization failed:', error);
    }
  }
}
