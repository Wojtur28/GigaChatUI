import {Component} from '@angular/core';
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {Router} from "@angular/router";

@Component({
    selector: 'app-landing-page',
    templateUrl: './landing-page.component.html',
    styleUrl: './landing-page.component.css',
    standalone: true,
    imports: [
        MatButtonModule,
        MatMenuModule,
        MatCardModule,
        MatIconModule
    ]
})
export class LandingPageComponent {
    constructor(private router: Router) {
    }

    navigateTo(path: string): void {
        this.router.navigate([path]);
    }
}
