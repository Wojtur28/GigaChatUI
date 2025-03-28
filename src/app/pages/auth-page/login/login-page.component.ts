import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from "../../../service/auth-service";
import {NgIf} from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  loginError = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
  }


  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });

    if (this.authService.isAuthenticated()) {
      console.log('Already authenticated, navigating to landing page');
      this.router.navigate(['/']);
    }
  }

  login(): void {
    this.submitted = true;
    this.loginError = '';

    if (this.loginForm.invalid) return;

    console.log('Attempting login...');
    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        console.log('Login API response:', response);
        this.authService.storeToken(response.token);

        const storedToken = localStorage.getItem('auth_token');
        console.log('Token stored in localStorage:', !!storedToken);
        const isAuth = this.authService.isAuthenticated();
        console.log('Is authenticated after login:', isAuth);

        console.log('Navigating to landing page...');
        this.router.navigate(['/'], {skipLocationChange: false}).then(success => {
          console.log('Navigation result:', success);
          if (!success) {
            console.log('Trying alternative navigation...');
            window.location.href = '/';
          }
        });
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.loginError = 'Login failed. Please check your credentials.';
      }
    });
  }


}
