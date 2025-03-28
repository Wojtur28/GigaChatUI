import {Injectable, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from './auth-service';
import {Subscription, timer} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenExpirationService implements OnDestroy {
  private tokenExpirationTimer: Subscription | null = null;
  private readonly TOKEN_EXPIRATION_TIME = 3600000;

  constructor(private authService: AuthService, private router: Router) {
  }

  startExpirationTimer(token: string): void {
    this.clearExpirationTimer();
    let expirationTime = this.TOKEN_EXPIRATION_TIME;
    try {
      const tokenParts = token.split('.');
      if (tokenParts.length < 3) {
        console.warn('Token does not appear to be in JWT format, using default expiration time.');
      } else {
        const base64Url = tokenParts[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));
        if (payload.exp) {
          const expirationDate = new Date(payload.exp * 1000);
          const now = new Date();
          expirationTime = expirationDate.getTime() - now.getTime();
          if (expirationTime < 10000) {
            this.authService.logout();
            return;
          }
        }
      }
    } catch (e) {
      console.error('Error parsing token:', e);
    }
    console.log(`Token will expire in ${expirationTime / 1000} seconds`);
    this.tokenExpirationTimer = timer(expirationTime).subscribe(() => {
      console.log('Token expired, logging out...');
      this.authService.logout();
    });
  }

  clearExpirationTimer(): void {
    if (this.tokenExpirationTimer) {
      this.tokenExpirationTimer.unsubscribe();
      this.tokenExpirationTimer = null;
    }
  }

  initializeTokenTimer(): void {
    const token = this.authService.getToken();
    if (token && !this.authService.isTokenExpired(token)) {
      this.startExpirationTimer(token);
    }
  }

  ngOnDestroy(): void {
    this.clearExpirationTimer();
  }
}
