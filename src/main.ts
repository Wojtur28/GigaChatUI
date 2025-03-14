import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

document.documentElement.classList.add("dark")

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
