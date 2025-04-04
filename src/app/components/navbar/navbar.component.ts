import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../service/auth-service';
import {MatButtonModule} from "@angular/material/button";
import {MatMenuModule} from "@angular/material/menu";
import {MatIconModule} from "@angular/material/icon";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    NgIf
  ]
})
export class NavbarComponent {
  constructor(
    private router: Router,
    protected authService: AuthService
  ) {
  }


  isAdmin(): boolean {
    return this.authService.isAdmin();
  }


  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  navigateToAdmin(): void {
    this.router.navigate(['/admin']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['auth/login']);
  }
}
