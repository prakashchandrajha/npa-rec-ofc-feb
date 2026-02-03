import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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
  loginError: string = '';

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  constructor(private router: Router, private authService: AuthService) {}

  onSubmit(): void {
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.authService.setToken(response.token);
        localStorage.setItem('isLoggedIn', 'true');
        this.router.navigate(['/dashboard/dashboard-home']);
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.loginError = 'Invalid username or password';
      }
    });
  }

}
