import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from '../service/auth-service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('Auth Guard - Checking authentication for route:', state.url);

  if (authService.isAuthenticated()) {
    console.log('Auth Guard - User is authenticated, allowing access');
    return true;
  }

  console.log('Auth Guard - User is not authenticated, redirecting to login');
  router.navigate(['/auth/login']);
  return false;
};
