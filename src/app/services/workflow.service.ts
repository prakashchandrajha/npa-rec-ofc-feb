import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface RecoveryUser {
  id: number;
  username: string;
  displayName: string;
  enabled: boolean;
}

export interface ForwardTaskRequest {
  taskId: string;
  forwardToUserId: number;
  note?: string;
  payload?: any;
}

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {
  private apiUrl = 'http://localhost:8080/api/workflow';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Get recovery users for forwarding
  getRecoveryUsers(): Observable<RecoveryUser[]> {
    return this.http.get<RecoveryUser[]>(`${this.apiUrl}/recovery-users`, {
      headers: this.getHeaders()
    });
  }

  // Forward task to another recovery user
  forwardTask(request: ForwardTaskRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/task/forward`, request, {
      headers: this.getHeaders()
    });
  }
}
