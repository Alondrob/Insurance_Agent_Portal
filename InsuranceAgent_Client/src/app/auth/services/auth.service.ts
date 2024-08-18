import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SocialAuthService, GoogleLoginProvider, SocialUser } from '@abacritt/angularx-social-login';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5001/user-services'; // Replace with your API endpoint

  constructor(private http: HttpClient, private socialAuthService: SocialAuthService) {}
//authService
loginWithGoogle(idToken: string): Observable<any> {
    try {
        const url = `${this.apiUrl}/api/auth/loginWithGoogle`;
        const payload = { idToken };
        console.log('Request URL:', url);
        console.log('Request Payload:', payload);

        return this.http.post(url, payload, { observe: 'response' }).pipe(
            map((response) => {
                console.log('Full response received:', response);
                return response.body;
            }),
            catchError((error) => {
                console.error('Google login error:', error);
                return of(null);
            })
        );
    } catch (error) {
        console.error('Synchronous error:', error);
        return of(null);
    }
}
  
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/auth/login`, credentials).pipe(
      map((response) => response),
      catchError((error) => {
        console.error('Login error:', error);
        return of(null);
      })
    );
  }

 register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/auth/register`, userData).pipe(
      map((response) => response),
      catchError((error) => {
        console.error('Registration error:', error);
        return of(null);
      })
    );
  }

  verifyGoogleToken(idToken: string): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/api/auth/loginWithGoogle`, idToken)
      .pipe(
        map((response) => response),
        catchError((error) => {
          console.error('Google token verification error:', error);
          return of(null);
        })
      );
  }

isAuthenticated(): Observable<boolean> {
    return this.http.get(`${this.apiUrl}/api/auth/is-authenticated`).pipe(
      map((response) => true), // Replace with your actual response handling
      catchError(() => {
        console.error('Authentication check error');
        return of(false);
      })
    );
  }
}
