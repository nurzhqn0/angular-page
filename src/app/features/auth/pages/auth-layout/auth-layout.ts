import { CommonModule } from '@angular/common';
import { Component, DOCUMENT, Inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.css',
})
export class AuthLayoutComponent implements OnInit {
  isDarkMode = false;

  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngOnInit(): void {
    this.isDarkMode = this.document.documentElement.classList.contains('dark');
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
}
