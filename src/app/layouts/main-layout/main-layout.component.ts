import {Component} from '@angular/core';
import {NavbarComponent} from '../../components/navbar/navbar.component';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css'],
  standalone: true,
  imports: [
    NavbarComponent,
    RouterOutlet
  ]
})
export class MainLayoutComponent {
}
