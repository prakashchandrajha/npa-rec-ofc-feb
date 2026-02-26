import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

interface NpaRecord {
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
  status?: string;
  createdAt?: string;
  taskName?: string;
  task?: {
    taskName: string;
    taskId: string;
  };
}

@Component({
  selector: 'app-all-npa',
  imports: [CommonModule, RouterModule],
  templateUrl: './all-npa.html',
  styleUrl: './all-npa.css',
})
export class AllNpa implements OnInit, OnDestroy {
  npaRecords: NpaRecord[] = [];
  loading = false;
  error = '';
  private navigationSubscription: any;
  private apiUrl = 'http://localhost:8080/api/npa';
  private loadedOnce = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    // Subscribe to navigation events
    this.navigationSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        console.log('AllNpa router event', event);
        if (event.urlAfterRedirects.includes('/dashboard/all-npa')) {
          if (!this.loadedOnce) {
            console.log('NavigationEnd to all-npa detected, loading NPA records');
            this.loadAllNpa();
            this.loadedOnce = true;
          }
        } else {
          // Left the route – allow reload next time
          this.loadedOnce = false;
        }
      });

    // If the component is constructed while already on the destination URL
    if (this.router.url.includes('/dashboard/all-npa') && !this.loadedOnce) {
      console.log('Constructor check: currently on all-npa, loading records');
      this.loadAllNpa();
      this.loadedOnce = true;
    }
  }

  ngOnInit(): void {
    console.log('AllNpa ngOnInit');
  }

  ngOnDestroy(): void {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  loadAllNpa(): void {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] loadAllNpa called, loading flag before:`, this.loading);
    
    if (this.loading) {
      console.log(`[${timestamp}] loadAllNpa called but a load is already in progress; skipping`);
      return;
    }
    
    this.loading = true;
    this.error = '';
    
    const token = this.authService.getToken();
    console.log(`[${timestamp}] Using auth token for request:`, token);
    
    if (!token) {
      console.warn(`[${timestamp}] Token not present when loading NPA records, retrying in 100ms`);
      this.loading = false;
      setTimeout(() => this.loadAllNpa(), 100);
      return;
    }
    
    console.log(`[${timestamp}] Making API call to:`, this.apiUrl);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.get<any>(this.apiUrl, { headers }).subscribe({
      next: (response) => {
        const responseTimestamp = new Date().toISOString();
        console.log(`[${responseTimestamp}] API RESPONSE received:`, response);
        console.log(`[${responseTimestamp}] Response type:`, Array.isArray(response) ? 'Array' : typeof response);
        
        // Extract array from response
        const extract = (res: any): NpaRecord[] => {
          if (!res) { return []; }
          if (Array.isArray(res)) { return res; }
          if (Array.isArray(res.data)) { return res.data; }
          if (Array.isArray(res.npaRecords)) { return res.npaRecords; }
          if (res.data && Array.isArray(res.data.npaRecords)) { return res.data.npaRecords; }
          return [];
        };
        
        this.npaRecords = extract(response);
        console.log(`[${responseTimestamp}] Final NPA records array:`, this.npaRecords);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching NPA records:', err);
        this.error = 'Failed to load NPA records';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
