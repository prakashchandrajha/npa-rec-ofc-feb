import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BasicDetailsOfTheBorrower } from '../../interface/basic-details-of-borrower';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

interface Task {
  taskId: string | null;
  taskKey: string | null;
  taskName: string | null;
  assignee: string | null;
  candidateGroups: string[] | null;
  canCurrentUserAct: boolean;
  processInstanceId: string | null;
  npaId: number | null;
}

@Component({
  selector: 'app-npa-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './npa-detail.component.html',
  styleUrl: './npa-detail.component.css'
})
export class NpaDetailComponent implements OnInit, OnDestroy, AfterViewInit {
  npaId: string = '';
  npaData: BasicDetailsOfTheBorrower | null = null;
  loading: boolean = true;
  error: string | null = null;
  
  // Task related properties
  currentTask: Task | null = null;
  taskLoading: boolean = false;
  taskError: string | null = null;
  
  // Modal related properties
  showTaskModal: boolean = false;
  taskNotes: string = '';
  selectedFiles: File[] = [];
  submittingTask: boolean = false;
  submitError: string | null = null;
  amount: number | null = null;
  
  // Regional Offices (ROS) related properties
  regionalOffices: any[] = [];
  selectedRegionalOffice: string = '';
  loadingRegionalOffices: boolean = false;
  
  // Completed tasks history properties
  completedTasks: any[] = [];
  loadingCompletedTasks: boolean = false;
  completedTasksError: string | null = null;
  
  private npaSubscription: Subscription | null = null;
  private taskSubscription: Subscription | null = null;
  private navigationSubscription: Subscription | null = null;
  private historySubscription: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('NpaDetail component initialized');
    this.npaId = this.route.snapshot.paramMap.get('id') || '';
    
    // Subscribe to router events to reload data when navigating to this route
    this.navigationSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        if (event instanceof NavigationEnd) {
          // Check if we're navigating to an NPA detail route
          if (event.urlAfterRedirects.includes('/dashboard/npa-detail/')) {
            console.log('Navigated to NPA detail route, reloading data');
            // Get the new NPA ID from the route
            const newNpaId = this.route.snapshot.paramMap.get('id') || '';
            if (newNpaId !== this.npaId) {
              this.npaId = newNpaId;
            }
            this.fetchNpaDetails();
            this.fetchCurrentTask();
            this.fetchCompletedTasks();
          }
        }
      });
    
    if (this.npaId) {
      this.fetchNpaDetails();
      this.fetchCurrentTask();
      this.fetchCompletedTasks();
    } else {
      this.error = 'NPA ID not provided';
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  fetchNpaDetails(): void {
    // Prevent multiple simultaneous calls
    if (this.loading && this.npaSubscription) {
      console.log('Already loading NPA details, skipping duplicate call');
      return;
    }

    const token = this.authService.getToken();
    
    // Debug logs
    console.log('=== NPA Detail Authentication Debug ===');
    console.log('Token from AuthService:', token);
    console.log('Is user logged in:', this.authService.isLoggedIn());
    console.log('User info:', this.authService.getUserInfo());
    console.log('Fetching NPA ID:', this.npaId);
    
    if (!token) {
      this.error = 'Authentication token not found. Please login again.';
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    console.log('Starting to load NPA details...');
    this.loading = true;
    this.error = null;
    this.cdr.detectChanges();

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    this.npaSubscription = this.http.get<{ basicDetails: BasicDetailsOfTheBorrower }>(`http://localhost:8080/api/npa/${this.npaId}`, { headers })
      .subscribe({
        next: (response) => {
          console.log('NPA details loaded successfully:', response);
          this.npaData = response.basicDetails;
          this.loading = false;
          this.npaSubscription = null;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error fetching NPA details:', error);
          this.error = 'Failed to load NPA details. Please try again.';
          this.loading = false;
          this.npaSubscription = null;
          this.cdr.detectChanges();
        }
      });
  }

  fetchCurrentTask(): void {
    const token = this.authService.getToken();
    
    if (!token) {
      this.taskError = 'Authentication token not found. Please login again.';
      this.taskLoading = false;
      return;
    }

    console.log('Fetching current task for NPA ID:', this.npaId);
    this.taskLoading = true;
    this.taskError = null;

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    this.taskSubscription = this.http.get<any>(`http://localhost:8080/api/workflow/task/by-npa/${this.npaId}`, { headers })
      .subscribe({
        next: (response) => {
          console.log('Current task loaded successfully:', response);
          this.currentTask = response;
          this.taskLoading = false;
          this.taskSubscription = null;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error fetching current task:', error);
          this.taskError = 'Failed to load current task.';
          this.taskLoading = false;
          this.taskSubscription = null;
          this.cdr.detectChanges();
        }
      });
  }

  fetchRegionalOffices(): void {
    const token = this.authService.getToken();
    
    if (!token) {
      console.error('Authentication token not found');
      return;
    }

    console.log('Fetching regional offices...');
    this.loadingRegionalOffices = true;

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    this.http.get<any[]>('http://localhost:8080/api/users/regional-offices', { headers })
      .subscribe({
        next: (response) => {
          console.log('Regional offices loaded successfully:', response);
          this.regionalOffices = response;
          this.loadingRegionalOffices = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error fetching regional offices:', error);
          this.loadingRegionalOffices = false;
          this.cdr.detectChanges();
        }
      });
  }

  openTaskModal(): void {
    if (this.currentTask && this.currentTask.canCurrentUserAct) {
      this.showTaskModal = true;
      this.taskNotes = '';
      this.selectedFiles = [];
      this.submitError = null;
      this.selectedRegionalOffice = '';
      
      // Fetch regional offices only when task key is 'after_vetting_13_2'
      if (this.currentTask.taskKey === 'after_vetting_13_2') {
        this.fetchRegionalOffices();
      }
      
      this.cdr.detectChanges();
    }
  }

  closeTaskModal(): void {
    this.showTaskModal = false;
    this.taskNotes = '';
    this.selectedFiles = [];
    this.submitError = null;
    this.selectedRegionalOffice = '';
    this.regionalOffices = [];
    this.amount = null;
    this.cdr.detectChanges();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      for (let i = 0; i < input.files.length; i++) {
        const file = input.files[i];
        
        // Validate file type (PDF only)
        if (file.type !== 'application/pdf') {
          this.submitError = `Only PDF files are allowed. ${file.name} is not a PDF.`;
          this.cdr.detectChanges();
          continue;
        }
        
        // Validate file size (10MB limit)
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes
        if (file.size > maxSize) {
          this.submitError = `File ${file.name} is too large. Maximum size is 10MB.`;
          this.cdr.detectChanges();
          continue;
        }
        
        this.selectedFiles.push(file);
        console.log('File selected:', file.name, 'Size:', (file.size / 1024 / 1024).toFixed(2), 'MB');
      }
      this.cdr.detectChanges();
    }
  }

  removeFile(index: number): void {
    if (index >= 0 && index < this.selectedFiles.length) {
      this.selectedFiles.splice(index, 1);
      this.cdr.detectChanges();
    }
  }

  async completeTask(): Promise<void> {
    if (!this.currentTask || !this.currentTask.taskId) {
      return;
    }

    const token = this.authService.getToken();
    
    if (!token) {
      this.submitError = 'Authentication token not found. Please login again.';
      return;
    }

    console.log('Starting task completion with file upload...');
    this.submittingTask = true;
    this.submitError = null;

    try {
      // Step 1: Upload files first
      const attachmentIds: string[] = [];
      
      if (this.selectedFiles.length > 0) {
        console.log('Uploading', this.selectedFiles.length, 'files...');
        
        for (const file of this.selectedFiles) {
          try {
            const attachmentId = await this.uploadFile(file);
            attachmentIds.push(attachmentId);
            console.log('File uploaded successfully:', file.name, 'ID:', attachmentId);
          } catch (error) {
            console.error('Failed to upload file:', file.name, error);
            this.submitError = `Failed to upload file: ${file.name}`;
            this.submittingTask = false;
            this.cdr.detectChanges();
            return;
          }
        }
      }

      // Step 2: Complete the task with attachment IDs
      console.log('Completing task with', attachmentIds.length, 'attachments');
      
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      // Build payload with notes and attachment IDs
      const payload: any = {
        field1: 'value1'
      };

      if (this.taskNotes) {
        payload.notes = this.taskNotes;
      }

      // Add regional office to payload when task key is 'after_vetting_13_2'
      if (this.currentTask.taskKey === 'after_vetting_13_2' && this.selectedRegionalOffice) {
        payload.regionalOffice = this.selectedRegionalOffice;
      }

      // Add amount to payload for specific tasks
      const tasksWithAmount = ['loan_amount', 'Loan_loan_amount', 'after_vet_sale_notice', 'divisional_meeting'];
      if (this.currentTask.taskKey && tasksWithAmount.includes(this.currentTask.taskKey) && this.amount !== null) {
        payload.amount = this.amount;
      }

      const requestBody = {
        taskId: this.currentTask.taskId,
        payload: payload,
        attachmentIds: attachmentIds,
        note: this.taskNotes || ''
      };

      console.log('Task completion request:', requestBody);

      this.http.post<any>('http://localhost:8080/api/workflow/task/complete', requestBody, { headers })
        .subscribe({
          next: (response) => {
            console.log('Task completed successfully:', response);
            this.submittingTask = false;
            this.showTaskModal = false;
            // Refresh the task to get updated status
            this.fetchCurrentTask();
            this.fetchCompletedTasks();
            this.cdr.detectChanges();
          },
          error: (error) => {
            console.error('Error completing task:', error);
            this.submittingTask = false;
            this.submitError = 'Failed to complete task. Please try again.';
            this.cdr.detectChanges();
          }
        });

    } catch (error) {
      console.error('Error in task completion process:', error);
      this.submittingTask = false;
      this.submitError = 'Failed to complete task. Please try again.';
      this.cdr.detectChanges();
    }
  }

  private uploadFile(file: File): Promise<string> {
    const token = this.authService.getToken();
    
    if (!token) {
      return Promise.reject('Authentication token not found');
    }

    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('taskId', this.currentTask?.taskId || '');

      const headers = {
        'Authorization': `Bearer ${token}`
      };

      console.log('Uploading file:', file.name, 'to taskId:', this.currentTask?.taskId);

      this.http.post<any>('http://localhost:8080/api/files/upload', formData, { headers })
        .subscribe({
          next: (response) => {
            console.log('File upload response:', response);
            resolve(response.id.toString());
          },
          error: (error) => {
            console.error('File upload error:', error);
            reject(error);
          }
        });
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard/all-npa']);
  }

  editNpa(): void {
    this.router.navigate([`/edit-npa/${this.npaId}`]);
  }

  ngAfterViewInit(): void {
    console.log('NpaDetail component view initialized');
  }

  ngOnDestroy(): void {
    if (this.npaSubscription) {
      this.npaSubscription.unsubscribe();
      this.npaSubscription = null;
    }
    if (this.taskSubscription) {
      this.taskSubscription.unsubscribe();
      this.taskSubscription = null;
    }
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
      this.navigationSubscription = null;
    }
    if (this.historySubscription) {
      this.historySubscription.unsubscribe();
      this.historySubscription = null;
    }
    console.log('NpaDetail component destroyed');
  }

  refreshNpaDetails(): void {
    console.log('Refreshing NPA details');
    this.fetchNpaDetails();
  }

  fetchCompletedTasks(): void {
    const token = this.authService.getToken();
    
    if (!token) {
      this.completedTasksError = 'Authentication token not found. Please login again.';
      this.loadingCompletedTasks = false;
      return;
    }

    console.log('Fetching completed tasks for NPA ID:', this.npaId);
    this.loadingCompletedTasks = true;
    this.completedTasksError = null;

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    this.historySubscription = this.http.get<any[]>(`http://localhost:8080/api/npa/${this.npaId}/history`, { headers })
      .subscribe({
        next: (response) => {
          console.log('Completed tasks loaded successfully:', response);
          this.completedTasks = response;
          this.loadingCompletedTasks = false;
          this.historySubscription = null;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error fetching completed tasks:', error);
          this.completedTasksError = 'Failed to load completed tasks history.';
          this.loadingCompletedTasks = false;
          this.historySubscription = null;
          this.cdr.detectChanges();
        }
      });
  }

  downloadAttachment(attachmentId: string, fileName: string): void {
    const token = this.authService.getToken();
    
    if (!token) {
      console.error('Authentication token not found');
      return;
    }

    const headers = {
      'Authorization': `Bearer ${token}`
    };

    console.log('Downloading attachment:', attachmentId);

    this.http.get(`http://localhost:8080/api/files/download/${attachmentId}`, { 
      headers,
      responseType: 'blob' 
    }).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        console.log('File downloaded successfully:', fileName);
      },
      error: (error) => {
        console.error('Error downloading attachment:', error);
      }
    });
  }
}
