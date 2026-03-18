import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { UserService, User } from '../../services/user.service';
import { WorkflowService } from '../../services/workflow.service';

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
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './my-desk.html',
  styleUrl: './my-desk.css',
})
export class MyDesk implements OnInit, OnDestroy {
  tasks: Task[] = [];
  loading = false;
  error = '';
  
  // For task assignment
  showAssignModal = false;
  selectedTask: Task | null = null;
  recoveryUsers: User[] = [];
  selectedChildUsername = '';
  assigningTask = false;
  assignmentError = '';
  assignmentSuccess = '';
  
  // Current user info
  currentUserType: string = '';
  
  private navigationSubscription: any;
  private retryCount = 0;
  private apiUrl = 'http://localhost:8080/api/workflow/tasks/my-desk';
  private loadedOnce = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private userService: UserService,
    private workflowService: WorkflowService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    // subscribe to navigation events here so we get the very first NavigationEnd
    // that brings us to the route.  Doing this in the constructor avoids the
    // double-call bug we were observing when setting up the subscription in
    // ngOnInit and also invoking loadTasks() there.
    this.navigationSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        console.log('MyDesk router event in constructor', event);
        if (event.urlAfterRedirects.includes('/dashboard/my-desk')) {
          if (!this.loadedOnce) {
            console.log('NavigationEnd to my-desk detected in constructor, loading tasks');
            this.loadTasks();
            this.loadedOnce = true;
          }
        } else {
          // left the route – allow reload next time
          this.loadedOnce = false;
        }
      });

    // if the component is constructed while already on the destination URL
    // (e.g. hard reload or navigating programmatically), trigger a load once
    // immediately.
    if (this.router.url.includes('/dashboard/my-desk') && !this.loadedOnce) {
      console.log('Constructor check: currently on my-desk, loading tasks');
      this.loadTasks();
      this.loadedOnce = true;
    }
  }

  ngOnInit(): void {
    console.log('MyDesk ngOnInit');
    // Get current user info
    const userInfo = this.authService.getUserInfo();
    console.log('UserInfo from localStorage:', userInfo);
    if (userInfo) {
      this.currentUserType = userInfo.userType || '';
      console.log('Current user type set to:', this.currentUserType);
    } else {
      console.warn('No userInfo found in localStorage');
    }
    // no additional work here; navigation handling is performed in the
    // constructor so that the first NavigationEnd is caught reliably.
  }

  ngOnDestroy(): void {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  loadTasks(): void {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] loadTasks called, loading flag before:`, this.loading);
    if (this.loading) {
      console.log(`[${timestamp}] loadTasks called but a load is already in progress; skipping`);
      return;
    }
    this.loading = true;
    this.error = '';
    
    const token = this.authService.getToken();
    console.log(`[${timestamp}] Using auth token for request:`, token);
    // if token is not available yet (race condition during startup) we
    // don't want to fire a request that will immediately fail with 401.  In
    // that case, schedule a retry a short time later rather than forcing the
    // user to click again.
    if (!token) {
      console.warn(`[${timestamp}] Token not present when loading tasks, retrying in 100ms`);
      this.loading = false; // reset flag since we didn't actually send anything
      setTimeout(() => this.loadTasks(), 100);
      return;
    }
    console.log(`[${timestamp}] Making API call to:`, this.apiUrl);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    console.log(`[${timestamp}] Request headers:`, headers);
    
    this.http.get<any>(this.apiUrl, { headers }).subscribe({
      next: (response) => {
        const responseTimestamp = new Date().toISOString();
        console.log(`[${responseTimestamp}] API RESPONSE received:`, response);
        console.log(`[${responseTimestamp}] Response type:`, Array.isArray(response) ? 'Array' : typeof response);
        console.log(`[${responseTimestamp}] Response data:`, Array.isArray(response) ? response : response.data);
        // extract an array of tasks from the server response; some endpoints
        // wrap the data differently depending on context.
        const extract = (res: any): Task[] => {
          if (!res) { return []; }
          if (Array.isArray(res)) { return res; }
          if (Array.isArray(res.data)) { return res.data; }
          if (Array.isArray(res.tasks)) { return res.tasks; }
          if (res.data && Array.isArray(res.data.tasks)) { return res.data.tasks; }
          // fall back to empty array
          return [];
        };
        this.tasks = extract(response);
        console.log(`[${responseTimestamp}] Final tasks array:`, this.tasks);
        // view update may not run automatically in some navigation cases
        // if we received an empty list on the first attempt, it's possible
        // the backend is still populating results. replicate the "second
        // click" behaviour automatically by trying one more time after a
        // short delay; do not loop indefinitely.
        if (this.tasks.length === 0 && this.retryCount === 0) {
          this.retryCount++;
          console.warn('tasks empty, retrying once');
          setTimeout(() => this.loadTasks(), 200);
        }
        this.loading = false;
        // ensure view reflects both the new tasks array and loading state
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching tasks:', err);
        this.error = 'Failed to load tasks';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Check if current user is a recovery user who can assign tasks
  isRecoveryUser(): boolean {
    return this.currentUserType === 'RECOVERY';
  }

  // Open the assignment modal
  openAssignModal(task: Task): void {
    this.selectedTask = task;
    this.selectedChildUsername = '';
    this.assignmentError = '';
    this.assignmentSuccess = '';
    this.showAssignModal = true;
    this.loadRecoveryUsers();
  }

  // Close the assignment modal
  closeAssignModal(): void {
    this.showAssignModal = false;
    this.selectedTask = null;
    this.selectedChildUsername = '';
    this.assignmentError = '';
    this.assignmentSuccess = '';
  }

  // Load recovery users for assignment
  loadRecoveryUsers(): void {
    console.log('Loading recovery users...');
    this.userService.getRecoveryUsers().subscribe({
      next: (users) => {
        console.log('All users received:', users);
        // Filter out the current user from the list
        const currentUsername = this.authService.getUserInfo()?.username;
        console.log('Current username:', currentUsername);
        this.recoveryUsers = users.filter(u => u.username !== currentUsername);
        console.log('Filtered recovery users:', this.recoveryUsers);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading recovery users:', err);
        this.assignmentError = 'Failed to load recovery users: ' + (err.message || 'Unknown error');
        this.cdr.detectChanges();
      }
    });
  }

  // Assign task to selected child user
  assignTask(): void {
    if (!this.selectedTask || !this.selectedChildUsername) {
      this.assignmentError = 'Please select a user to assign the task';
      return;
    }

    this.assigningTask = true;
    this.assignmentError = '';
    this.assignmentSuccess = '';

    const request = {
      taskId: this.selectedTask.taskId,
      childUsername: this.selectedChildUsername
    };

    this.workflowService.forwardTask(request).subscribe({
      next: () => {
        console.log('Task assigned successfully');
        this.assignmentSuccess = 'Task assigned successfully!';
        this.assigningTask = false;
        // Close modal and refresh tasks after a short delay
        setTimeout(() => {
          this.closeAssignModal();
          this.loadTasks();
        }, 1500);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error assigning task:', err);
        this.assignmentError = 'Failed to assign task. Please try again.';
        this.assigningTask = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Check if current user can forward task (recovery user with canCurrentUserAct)
  canForwardTask(task: Task): boolean {
    return this.isRecoveryUser() && task.canCurrentUserAct;
  }

  /**
   * Check if the NPA is overdue based on the NPA date
   * @param npaDateString The NPA date string (can be undefined)
   * @returns true if overdue, false otherwise
   */
  isOverdue(npaDateString: string | undefined): boolean {
    if (!npaDateString) return false;
    const npaDate = new Date(npaDateString);
    const today = new Date();
    today.setHours(0,0,0,0);
    return npaDate < today;
  }

  // Open forward dialog (alias for openAssignModal)
  openForwardDialog(task: Task): void {
    this.openAssignModal(task);
  }

  // Complete task from my desk
  completeTask(task: Task): void {
    if (!task.canCurrentUserAct) {
      console.error('User cannot act on this task');
      return;
    }

    const request = {
      taskId: task.taskId,
      npaId: task.npaId,
      variables: {}
    };

    this.workflowService.completeTask(request).subscribe({
      next: () => {
        console.log('Task completed successfully');
        this.loadTasks(); // Refresh tasks
      },
      error: (err) => {
        console.error('Error completing task:', err);
        this.error = 'Failed to complete task. Please try again.';
      }
    });
  }
}