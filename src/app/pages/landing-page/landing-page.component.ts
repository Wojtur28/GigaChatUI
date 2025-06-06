import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {MatButtonModule} from "@angular/material/button";
import {MatMenuModule} from "@angular/material/menu";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatMenuModule,
    MatCardModule,
    MatIconModule
  ]
})
export class LandingPageComponent {

  constructor(
    private router: Router
  ) {
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
