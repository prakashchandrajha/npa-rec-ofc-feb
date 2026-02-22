import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
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
export class MyDesk implements OnInit, OnDestroy {
  tasks: Task[] = [];
  loading = false;
  error = '';
  private navigationSubscription: any;
  private retryCount = 0;
  private apiUrl = 'http://localhost:8080/api/workflow/tasks/my-desk';
  private loadedOnce = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService
    , private router: Router
    , private cdr: ChangeDetectorRef
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
    // no additional work here; navigation handling is performed in the
    // constructor so that the first NavigationEnd is caught reliably.
  }

  ngOnDestroy(): void {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  loadTasks(): void {
    console.log('loadTasks called, loading flag before:', this.loading);
    // reset retry counter for each manual invocation
    this.retryCount = 0;
    if (this.loading) {
      console.log('loadTasks called but a load is already in progress; skipping');
      return;
    }
    this.loading = true;
    this.error = '';
    
    const token = this.authService.getToken();
    console.log('Using auth token for request:', token);
    // if the token is not available yet (race condition during startup) we
    // don't want to fire a request that will immediately fail with 401.  In
    // that case, schedule a retry a short time later rather than forcing the
    // user to click again.
    if (!token) {
      console.warn('Token not present when loading tasks, retrying in 100ms');
      this.loading = false; // reset flag since we didn't actually send anything
      setTimeout(() => this.loadTasks(), 100);
      return;
    }
    console.log('Using auth token for request:', token);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.get<any>(this.apiUrl, { headers }).subscribe({
      next: (response) => {
        console.log('loadTasks response:', response);
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
        console.log('tasks array now', this.tasks);
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
}