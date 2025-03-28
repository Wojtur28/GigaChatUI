import {Routes} from '@angular/router';
import {AuthLayoutComponent} from './layouts/auth-layout/auth-layout.component';
import {LoginPageComponent} from './pages/auth-page/login/login-page.component';
import {RegisterPageComponent} from './pages/auth-page/register/register-page.component';
import {LandingPageComponent} from './pages/landing-page/landing-page.component';
import {DirectChatPageComponent} from './pages/direct-chat/direct-chat-page.component';
import {authGuard} from './guards/auth-guard';
import {nonAuthGuard} from './guards/non-auth.guard';
import {MainLayoutComponent} from './layouts/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {path: '', component: LandingPageComponent},
      {path: 'group-chat', component: LandingPageComponent},
      {path: 'direct-chat', component: DirectChatPageComponent},
    ]
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    canActivate: [nonAuthGuard],
    children: [
      {path: 'login', component: LoginPageComponent},
      {path: 'register', component: RegisterPageComponent},
      {path: '', redirectTo: 'login', pathMatch: 'full'},
    ]
  },
];
