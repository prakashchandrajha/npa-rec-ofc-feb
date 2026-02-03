import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, User } from '../../services/user.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-users',
  imports: [CommonModule],
  templateUrl: './view-users.html',
  styleUrl: './view-users.css',
  standalone: true,
})
export class ViewUsers implements OnInit, OnDestroy, OnChanges {
  users: User[] = [];
  loading = false;
  error: string | null = null;
  private usersSubscription: Subscription | null = null;

  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    console.log('ViewUsers component initialized - loading users');
    this.loadUsers();
  }

  ngOnDestroy(): void {
    // Prevent memory leaks
    if (this.usersSubscription) {
      this.usersSubscription.unsubscribe();
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

    this.usersSubscription = this.userService.getUsers().subscribe({
      next: (users) => {
        console.log('Users loaded successfully:', users.length, 'users');
        this.users = users;
        this.loading = false;
        this.usersSubscription = null;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.error = 'Failed to load users. Please try again.';
        this.loading = false;
        this.usersSubscription = null;
      }
    });
  }

  trackByUserId(index: number, user: User): number {
    return user.userId || index;
  }
}