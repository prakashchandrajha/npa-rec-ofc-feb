import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

interface Task {
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

@Component({
  selector: 'app-my-desk',
  imports: [CommonModule, RouterModule],
  templateUrl: './my-desk.html',
  styleUrl: './my-desk.css',
})
export class MyDesk implements OnInit {
  tasks: Task[] = [];
  loading = false;
  error = '';
  private apiUrl = 'http://localhost:8080/api/workflow/tasks/my-desk';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading = true;
    this.error = '';
    
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.get<any>(this.apiUrl, { headers }).subscribe({
      next: (response) => {
        // Handle both array response and wrapped response
        this.tasks = Array.isArray(response) ? response : (response.data || []);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching tasks:', err);
        this.error = 'Failed to load tasks';
        this.loading = false;
      }
    });
  }
}