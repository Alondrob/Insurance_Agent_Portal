import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ClaimListComponent } from './claims/claim-list/claim-list.component';
import { RegisterComponent } from './auth/register/register.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'claims', component: ClaimListComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' } // Redirect any unknown paths to the home page
];
