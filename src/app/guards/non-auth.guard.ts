import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from '../service/auth-service';

export const nonAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('Non-Auth Guard - Checking authentication for route:', state.url);

  if (!authService.isAuthenticated()) {
    console.log('Non-Auth Guard - User is not authenticated, allowing access to auth pages');
    return true;
  }

  console.log('Non-Auth Guard - User is authenticated, redirecting to landing page');
  router.navigate(['/']);
  return false;
};
