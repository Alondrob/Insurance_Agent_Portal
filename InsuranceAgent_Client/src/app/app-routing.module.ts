import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClaimListComponent } from './claims/claim-list/claim-list.component';
import { RegisterComponent } from './auth/register/register.component';

const routes: Routes = [
  { path: 'claims', component: ClaimListComponent },
  { path: '', redirectTo: '/claims', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
