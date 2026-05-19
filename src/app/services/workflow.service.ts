import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Task {
  taskId: string;
  taskKey: string;
  taskName: string;
  assignee: string | null;
  candidateGroups: string[];
  canCurrentUserAct: boolean;
  processInstanceId: string;
  npaId: number;
  npa: {
    npaId: number;
    basicDetails: {
      id: number;
      divisionName: string;
      regionalOffice: string | null;
      accountName: string;
      npaDate: string;
      businessActivity: string;
      registeredAddress: string;
    };
    username: string;
    userType: string;
    divisionName: string;
    regionalOfficeName: string | null;
    processInstanceId: string;
    amount: number | null;
  };
}

export interface TaskCompleteRequest {
  taskId: string;
  npaId: number;
  variables?: { [key: string]: any };
}

export interface ForwardTaskRequest {
  taskId: string;
  childUsername: string;
}

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {
  private apiUrl = `${environment.apiUrl}/workflow`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getMyDeskTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/tasks/my-desk`, {
      headers: this.getAuthHeaders()
    });
  }

  getTaskByNpa(npaId: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/task/by-npa/${npaId}`, {
      headers: this.getAuthHeaders()
    });
  }

  completeTask(request: TaskCompleteRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/task/complete`, request, {
      headers: this.getAuthHeaders()
    });
  }

  forwardTask(request: ForwardTaskRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/task/forward`, request, {
      headers: this.getAuthHeaders()
    });
  }
}
