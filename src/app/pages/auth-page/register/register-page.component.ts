import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../service/auth-service';
import {NgIf} from '@angular/common';
import {Router} from '@angular/router';

@Component({
    selector: 'app-register-page',
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        NgIf
    ],
    templateUrl: './register-page.component.html',
    styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {
    registerForm!: FormGroup;
    submitted = false;
    registerError = '';

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
    }

    ngOnInit(): void {
        this.registerForm = this.fb.group({
            username: ['', Validators.required],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(4)]]
        });
    }

    register(): void {
        this.submitted = true;
        this.registerError = '';

        if (this.registerForm.invalid) return;

        this.authService.register(this.registerForm.value).subscribe({
            next: (response) => {
                this.authService.storeToken(response.token);

                console.log('Registration successful, navigating to landing page');
                this.router.navigate(['/']);
            },
            error: (error) => {
                console.error('Registration failed:', error);
                this.registerError = 'Registration failed. Please try again.';
            }
        });
    }
}
