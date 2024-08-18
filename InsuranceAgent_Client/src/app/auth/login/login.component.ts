import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService as LocalAuthService } from '../services/auth.service';
import { SocialAuthService, SocialUser, GoogleLoginProvider, GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, GoogleSigninButtonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  loginForm: FormGroup;
  user: SocialUser = new SocialUser();
  loggedIn: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: LocalAuthService,
    private socialAuthService: SocialAuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }
//loginComponent
  ngOnInit(): void {
    this.socialAuthService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
      if (this.loggedIn && user) {
        console.log("ngOnInit", user);
        //error here
        this.authService.loginWithGoogle(user.idToken).subscribe({
          next: (response: any) => {
            console.log('Google login successful', response);
            this.close.emit();
          },
          error: (error: any) => {
            console.error('Google login error', error);
          }
        });
      }
    });
  }

  signInWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(
      (user: SocialUser) => {
        this.authService.loginWithGoogle(user.idToken).subscribe({
          next: (response: any) => {
            console.log('signInWithGoogle login successful', response);
            this.close.emit();
          },
          error: (error: any) => {
            console.error('signInWithGoogle login error', error);
          }
        });
      }
    ).catch((err) => console.error('signInWithGoogle login error', err));
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
