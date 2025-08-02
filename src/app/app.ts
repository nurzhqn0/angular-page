import { Component, OnInit, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class AppComponent implements OnInit {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngOnInit(): void {
    console.log('🚀 Angular App initialized successfully');

    this.initializeTheme();
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
}
