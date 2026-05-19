import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface User {
  userId?: number;
  username: string;
  password?: string;
  userType?: string;
  divisionName?: string;
  regionalOfficeName?: string;
  isAdmin?: boolean;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private adminUrl = `${environment.apiUrl}/admin/users`;
  private publicUrl = `${environment.apiUrl}/users`;
  private loginUrl = `${environment.apiUrl}/auth/login`;

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  login(credentials: { username: string; password: string }): Observable<{ token: string; message: string }> {
    return this.http.post<{ token: string; message: string }>(this.loginUrl, credentials);
  }

  createUser(userData: any): Observable<any> {
    return this.http.post<any>(this.adminUrl, userData, {
      headers: this.getAuthHeaders()
    });
  }

  getUsers(): Observable<User[]> {
    // Public endpoint - no auth required
    return this.http.get<User[]>(this.publicUrl);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.adminUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  updateUser(id: number, userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.adminUrl}/${id}`, userData, {
      headers: this.getAuthHeaders()
    });
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.adminUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  getRecoveryUsers(): Observable<User[]> {
    // Use auth headers since user is logged in
    return this.http.get<User[]>(this.publicUrl, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(users => users.filter(user => user.userType === 'RECOVERY'))
    );
  }
}