import { Injectable, signal } from "@angular/core"

@Injectable({
  providedIn: "root",
})
export class ThemeService {
  private darkModeKey = "darkMode"
  private darkMode = signal(true)

  constructor() {
    this.initTheme()
  }

  private initTheme(): void {
    const storedPreference = localStorage.getItem(this.darkModeKey)

    if (storedPreference !== null) {
      this.darkMode.set(storedPreference === "true")
    }

    this.applyTheme()
  }

  private applyTheme(): void {
    if (this.darkMode()) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  toggleDarkMode(): void {
    this.darkMode.update((current) => !current)
    localStorage.setItem(this.darkModeKey, this.darkMode().toString())
    this.applyTheme()
  }

  isDarkMode(): boolean {
    return this.darkMode()
  }
}

