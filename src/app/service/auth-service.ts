import {LoginRequest} from '../model/login-request';
import {Observable} from 'rxjs';
import {LoginResponse} from '../model/login-response';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl;
  private tokenExpirationService: any;

  constructor(private http: HttpClient, private router: Router) {
  }

  setTokenExpirationService(service: any): void {
    this.tokenExpirationService = service;
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request);
  }

  register(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/register`, request);
  }

  storeToken(token: string): void {
    console.log('Storing token in localStorage');
    localStorage.setItem('auth_token', token);
    if (this.tokenExpirationService) {
      console.log('Starting token expiration timer');
      this.tokenExpirationService.startExpirationTimer(token);
    } else {
      console.warn('Token expiration service not set');
    }
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    const isValid = !!token && !this.isTokenExpired(token);
    console.log('Token exists:', !!token);
    console.log('Is token valid:', isValid);
    return isValid;
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  isTokenExpired(token: string): boolean {
    try {
      const tokenParts = token.split('.');
      if (tokenParts.length < 3) {
        console.warn('Token does not appear to be in JWT format, skipping expiration check.');
        return false;
      }
      const base64Url = tokenParts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      const isExpired = payload.exp ? payload.exp * 1000 < Date.now() : false;
      console.log('Token expiration time:', payload.exp ? new Date(payload.exp * 1000) : 'No expiration');
      console.log('Current time:', new Date());
      console.log('Is token expired:', isExpired);
      return isExpired;
    } catch (e) {
      console.error('Error parsing token:', e);
      return true;
    }
  }

  getUsernameFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(window.atob(token.split('.')[1]));
      return payload.username || payload.sub || null;
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  }

  logout(): void {
    console.log('Logging out user');
    localStorage.removeItem('auth_token');
    if (this.tokenExpirationService) {
      this.tokenExpirationService.clearExpirationTimer();
    }
    this.router.navigate(['/auth/login']);
  }
}
