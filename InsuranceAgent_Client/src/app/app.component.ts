import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet, Router } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthService } from './auth/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    RouterOutlet, SidebarComponent,
    HeaderComponent, LoginComponent, RegisterComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'InsuranceAgent_Client';
  isLoginModalOpen = false;
  isRegisterModalOpen = false;

  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit() {
    // Example logic for checking authentication status
    this.auth.isAuthenticated().subscribe(isAuthenticated => {
      if (!isAuthenticated) {
        this.openLoginModal();
      }
    });
  }

  openLoginModal() {
    this.isLoginModalOpen = true;
    this.isRegisterModalOpen = false;
  }

  openRegisterModal() {
    this.isRegisterModalOpen = true;
    this.isLoginModalOpen = false;
  }

  closeModals() {
    this.isLoginModalOpen = false;
    this.isRegisterModalOpen = false;
    this.router.navigate(['/']);  // Navigate back to main page
  }
}
