import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

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

  constructor(private router: Router, private authService: AuthService, private userService: UserService) {}

  onSubmit(): void {
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.authService.setToken(response.token);
        localStorage.setItem('isLoggedIn', 'true');
        
        // Try to get user details by ID if available, otherwise fetch all users
        if (response.userId) {
          this.userService.getUserById(response.userId).subscribe({
            next: (user) => {
              const userInfo = {
                username: this.username,
                division: user.divisionName || 'NPA',
                userType: user.userType || ''
              };
              this.authService.setUserInfo(userInfo);
              console.log('User info saved:', userInfo);
              this.router.navigate(['/dashboard/dashboard-home']);
            },
            error: (err) => {
              console.error('Error fetching user by ID:', err);
              this.fetchUsersAsFallback();
            }
          });
        } else {
          this.fetchUsersAsFallback();
        }
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.loginError = 'Invalid username or password';
      }
    });
  }

  private fetchUsersAsFallback(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        const currentUser = users.find((u: any) => u.username === this.username);
        const userType = currentUser ? (currentUser.userType || '') : '';
        
        const userInfo = {
          username: this.username,
          division: currentUser?.divisionName || 'NPA',
          userType: userType
        };
        this.authService.setUserInfo(userInfo);
        console.log('User info saved (fallback):', userInfo);
        this.router.navigate(['/dashboard/dashboard-home']);
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        const userInfo = {
          username: this.username,
          division: 'NPA',
          userType: ''
        };
        this.authService.setUserInfo(userInfo);
        this.router.navigate(['/dashboard/dashboard-home']);
      }
    });
  }

}
