import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService, User } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-create-user',
  imports: [FormsModule, CommonModule],
  templateUrl: './create-user.html',
  styleUrl: './create-user.css',
  standalone: true,
})
export class CreateUser {
  userTypes = [
    { value: 'DIVISION', label: 'Division' },
    { value: 'REGIONAL_OFFICE', label: 'Regional Office' },
    { value: 'RECOVERY', label: 'Recovery' },
    { value: 'LEGAL', label: 'Legal' },
    { value: 'LOAN', label: 'Loan' }
  ];

  divisions = [
    { value: 'SUGAR', label: 'Sugar' },
    { value: 'TEXTILE', label: 'Textile' },
    { value: 'CHEMICAL', label: 'Chemical' },
    { value: 'STEEL', label: 'Steel' }
  ];

  formData: User = {
    username: '',
    password: '',
    userType: 'DIVISION',
    divisionName: '',
    regionalOfficeName: ''
  };

  submitted = false;

  constructor(private userService: UserService, private authService: AuthService, private router: Router) {
    // Check if user is authenticated (admin)
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }

  get shouldShowDivisionField(): boolean {
    // Show division field only when user type is DIVISION
    return this.formData.userType === 'DIVISION';
  }

  get shouldShowRegionalOfficeField(): boolean {
    // Show regional office field only when user type is REGIONAL_OFFICE
    return this.formData.userType === 'REGIONAL_OFFICE';
  }

  onSubmit(): void {
    // Prepare the user data
    const userData = {
      username: this.formData.username,
      password: this.formData.password,
      userType: this.formData.userType,
      ...(this.shouldShowDivisionField && this.formData.divisionName && { divisionName: this.formData.divisionName }),
      ...(this.shouldShowRegionalOfficeField && this.formData.regionalOfficeName && { regionalOfficeName: this.formData.regionalOfficeName })
    };

    this.userService.createUser(userData).subscribe({
      next: (response) => {
        console.log('User created successfully:', response);
        alert('User created successfully!');
        this.resetForm();
        this.submitted = true;
      },
      error: (error) => {
        console.error('Error creating user:', error);
        alert(`Error creating user: ${error.message || 'Unknown error'}`);
      }
    });
  }

  resetForm(): void {
    this.formData = {
      username: '',
      password: '',
      userType: 'DIVISION',
      divisionName: '',
      regionalOfficeName: ''
    };
    this.submitted = false;
  }
}