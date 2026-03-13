import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

export interface UserInfo {
  username: string;
  division: string;
  userType: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth/login';
  private token: string | null = null;

  constructor(private http: HttpClient, private router: Router) {
    this.token = localStorage.getItem('token');
  }

  login(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(this.apiUrl, { username, password }, { headers });
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return this.token;
  }

  setUserInfo(userInfo: UserInfo): void {
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  }

  getUserInfo(): UserInfo | null {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  }

  logout(): void {
    console.log('AuthService logout called');
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userInfo');
    console.log('Navigating to /');
    this.router.navigate(['/']);
  }

  isLoggedIn(): boolean {
    return !!this.token;
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn();
  }
}