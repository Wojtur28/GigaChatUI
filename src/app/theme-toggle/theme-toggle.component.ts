import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import {ThemeService} from '../service/theme.service';

@Component({
  selector: "app-theme-toggle",
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      class="theme-toggle-btn"
      (click)="toggleTheme()"
      aria-label="Toggle dark mode">
      <svg
        *ngIf="isDarkMode"
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
      <svg
        *ngIf="!isDarkMode"
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    </button>
  `,
  styles: [
    `
    .theme-toggle-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background-color: transparent;
      color: rgb(var(--foreground));
      border: none;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .theme-toggle-btn:hover {
      background-color: rgba(var(--muted), 0.8);
    }
  `,
  ],
})
export class ThemeToggleComponent implements OnInit {
  isDarkMode = true

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.isDarkMode = this.themeService.isDarkMode()
  }

  toggleTheme(): void {
    this.themeService.toggleDarkMode()
    this.isDarkMode = this.themeService.isDarkMode()
  }
}

