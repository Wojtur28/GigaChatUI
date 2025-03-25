import {Routes} from '@angular/router';
import {AuthLayoutComponent} from './layouts/auth-layout/auth-layout.component';
import {LoginPageComponent} from './pages/auth-page/login/login-page.component';
import {RegisterPageComponent} from './pages/auth-page/register/register-page.component';
import {LandingPageLayoutComponent} from './layouts/landing-page-layout/landing-page-layout.component';
import {LandingPageComponent} from './pages/landing-page/landing-page.component';


export const routes: Routes = [
  {
    path: '',
    component: LandingPageLayoutComponent,
    children: [
      {path: '', component: LandingPageComponent}
    ]
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {path: 'login', component: LoginPageComponent},
      {path: 'register', component: RegisterPageComponent},
      {path: '', redirectTo: 'login', pathMatch: 'full'}
    ]
  },
  {path: '**', redirectTo: ''}
];
