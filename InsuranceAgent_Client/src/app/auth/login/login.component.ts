declare var google: any;
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService as LocalAuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  loginForm: FormGroup;
  loggedIn: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: LocalAuthService,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }
//loginComponent
   ngOnInit(): void {
    // Initialize Google Sign-In
    google.accounts.id.initialize({
      client_id: environment.googleClientId, // Replace with your actual client ID from environment
      callback: this.handleCredentialResponse.bind(this)
    });
    google.accounts.id.renderButton(
      document.getElementById("google-signin-button"), // Replace with the actual element ID
      { theme: "outline", size: "large" } // Customize the button as needed
    );
  }

  handleCredentialResponse(response: any) {
    console.log("Encoded JWT ID token: " + response.credential);

    // Use the ID token received from Google to authenticate with your backend
    this.authService.loginWithGoogle(response.credential).subscribe({
      next: (backendResponse: any) => {
        console.log('Google login successful', backendResponse);
        this.loggedIn = true;
        this.close.emit();
      },
      error: (error: any) => {
        console.error('Google login error', error);
      }
    });
  }

  signInWithGoogle(): void {
    // Trigger the Google Sign-In flow (optional if you need it outside the button)
    google.accounts.id.prompt();
  }
  
  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response: any) => {
          console.log('Login successful', response);
          this.close.emit();
        },
        error: (error: any) => {
          console.error('Login error', error);
        }
      });
    }
  }

  closeModal() {
    this.close.emit();
  }
}
