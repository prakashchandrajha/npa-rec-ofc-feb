import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, User } from '../../services/user.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-view-users',
  imports: [CommonModule],
  templateUrl: './view-users.html',
  styleUrl: './view-users.css',
  standalone: true,
})
export class ViewUsers implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  users: User[] = [];
  loading = false;
  error: string | null = null;
  private usersSubscription: Subscription | null = null;

  private navigationSubscription: Subscription | null = null;

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    console.log('ViewUsers component initialized - loading users');
    // Load users when component is initialized
    this.loadUsers();

    // Subscribe to router events to reload data when navigating to this route
    this.navigationSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        if (event instanceof NavigationEnd) {
          // Check if we're navigating to the view-users route
          if (event.urlAfterRedirects.includes('/dashboard/view-users')) {
            console.log('Navigated to view-users route, reloading data');
            // Reload data when navigating to this route
            this.loadUsers();
          }
        }
      });
  }

  ngAfterViewInit(): void {
    // View initialization complete
  }

  ngOnDestroy(): void {
    // Prevent memory leaks
    if (this.usersSubscription) {
      this.usersSubscription.unsubscribe();
    }
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  refreshUsers(): void {
    console.log('Refreshing users list');
    this.loadUsers();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // This will be called when the component receives new inputs
    // For route-based updates, we'll rely on route events
    console.log('ViewUsers component changes detected');
  }

  loadUsers(): void {
    // Prevent multiple simultaneous calls
    if (this.loading) {
      console.log('Already loading users, skipping duplicate call');
      return;
    }

    console.log('Starting to load users...');
    this.loading = true;
    this.error = null;
    this.cdr.detectChanges(); // Force change detection

    this.usersSubscription = this.userService.getUsers().subscribe({
      next: (users) => {
        console.log('Users loaded successfully:', users.length, 'users');
        this.users = users;
        this.loading = false;
        this.usersSubscription = null;
        this.cdr.detectChanges(); // Force change detection after data is loaded
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.error = 'Failed to load users. Please try again.';
        this.loading = false;
        this.usersSubscription = null;
        this.cdr.detectChanges(); // Force change detection after error
      }
    });
  }

  trackByUserId(index: number, user: User): number {
    return user.userId || index;
  }
}