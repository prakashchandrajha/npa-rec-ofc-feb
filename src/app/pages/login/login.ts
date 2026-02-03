import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule,FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  username: string = '';
  password: string = '';
  showPassword: boolean = false;

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  constructor(private router: Router) {}

  onSubmit(): void {
    // Handle form submission
    console.log('Login attempt:', {
      username: this.username,
      password: this.password,
    });
    
    // For now, we'll simulate successful login
    // Add your authentication logic here
    localStorage.setItem('isLoggedIn', 'true'); // Simple way to track login state
    this.router.navigate(['/dashboard/dashboard-content']);
  }

}
