import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/Controllers/AuthController';

  constructor(private http: HttpClient) { }

  // signUp(data: { username: string; password: string;email:string;confirmpassword:string }) {
  //   return this.http.post(`${this.apiUrl}/signup`, data).pipe(
  //     catchError(this.handleError)
  //   );
  // }
  // signUp(data: { username: string; password: string; email: string; confirmpassword: string }) {
  //   return this.http.post<any>(
  //     `${this.apiUrl}/signup`,
  //     data,
  //     { observe: 'response' } // important: this includes status, headers, etc.
  //   ).pipe(
  //     catchError(this.handleError)
  //   );
  // }

  signUp(data: { username: string; password: string; email: string; confirmpassword: string }) {
  return this.http.post<any>(
    `${this.apiUrl}/signup`,
    data,
    { observe: 'response' }  // allows access to status code
  ).pipe(
    catchError((error: HttpErrorResponse) => {
      // Let the component handle the error message
      return throwError(() => error);
    })
  );
 }

  // signIn(data: { username: string, password: string }) {
  //   return this.http.post<{ status: string; data: { token: string } }>(`${this.apiUrl}/signin`, data).pipe(
  //     tap(response => {
  //       if (response.status === 'ok') {
  //         localStorage.setItem('auth_token', response.data.token);
  //       }
  //     }),
  //     catchError(this.handleError)
  //   );
  // }

  signIn(data: { username: string; password: string }) {
  return this.http.post<any>(
    `${this.apiUrl}/signin`,
    data,
    { observe: 'response' }  // access full HTTP response with status and headers
  ).pipe(
    tap(response => {
      // If successful, store token
      const token = response.body?.data?.token;
      if (token) {
        localStorage.setItem('auth_token', token);
      }
    }),
    catchError((error: HttpErrorResponse) => {
      // Let component handle error
      return throwError(() => error);
    })
  );
}

  isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('auth_token');
 }

  logout() {
    localStorage.removeItem('auth_token');
  }

  private handleError(error: HttpErrorResponse) {
    const message =
      error.error?.error || 'An unknown error occurred';
    return throwError(() => new Error(message));
  }
}
