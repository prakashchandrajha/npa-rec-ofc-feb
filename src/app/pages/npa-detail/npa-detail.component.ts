import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  imports: [CommonModule],
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
  
  private npaSubscription: Subscription | null = null;
  private taskSubscription: Subscription | null = null;
  private navigationSubscription: Subscription | null = null;

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
          }
        }
      });
    
    if (this.npaId) {
      this.fetchNpaDetails();
      this.fetchCurrentTask();
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
    console.log('NpaDetail component destroyed');
  }

  refreshNpaDetails(): void {
    console.log('Refreshing NPA details');
    this.fetchNpaDetails();
  }
}
