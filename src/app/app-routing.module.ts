import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ConfirmRegistrationComponent } from './components/confirm-registration/confirm-registration.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AuthGuard } from './helpers/auth-guard';

const routes: Routes = [
  {
    path:'login',
    component: LoginComponent
  },
  {
    path:'',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path:'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path:'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'change-password/:token',
    component: ChangePasswordComponent,
  },
  {
    path: 'confirm-registration/:token',
    component: ConfirmRegistrationComponent,
  },
  {
    path:'page-not-found',
    component: PageNotFoundComponent,
  },
  {
    path:'**',
    redirectTo:'/login',
    pathMatch:'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
