import { Component, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { BasicDetailsOfTheBorrower01Component } from '../../child/basic-details-of-the-borrower-01/basic-details-of-the-borrower-01.component';
import { BasicDetailsOfTheBorrower } from '../../../interface/basic-details-of-borrower';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-npa-form',
  imports: [BasicDetailsOfTheBorrower01Component, CommonModule],
  templateUrl: './npa-form.component.html',
  styleUrl: './npa-form.component.css'
})
export class NpaFormComponent implements AfterViewInit {
  @ViewChild(BasicDetailsOfTheBorrower01Component) borrowerDetails!: BasicDetailsOfTheBorrower01Component;
  
  showModal: boolean = false;
  npaId: string = '';
  isSubmitting: boolean = false;
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router, private authService: AuthService, private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    // Child component is now available
  }

  onSubmit(): void {
    if (this.borrowerDetails && this.borrowerDetails.form) {
      // Mark all fields as touched to show validation errors
      this.borrowerDetails.form.markAllAsTouched();
      
      if (this.borrowerDetails.form.valid) {
        this.isSubmitting = true;
        this.errorMessage = '';
        
        const formData = this.borrowerDetails.form.value;
        
        // Prepare the request payload according to API specification
        const payload = {
          basicDetails: {
            divisionName: formData.divisionName,
            accountName: formData.accountName,
            npaDate: formData.npaClassificationDate,
            businessActivity: formData.businessActivity,
            registeredAddress: formData.registeredAddress,
            factoryRunningCondition: formData.factoryRunningCondition,
            factoryLeasedOut: formData.factoryLeasedOut,
            boardMembers: formData.boardMembers || []
          }
        };

        // Get auth token using AuthService
        const token = this.authService.getToken();
        
        // Debug logs
        console.log('=== Authentication Debug ===');
        console.log('Token from AuthService:', token);
        console.log('Is user logged in:', this.authService.isLoggedIn());
        console.log('User info:', this.authService.getUserInfo());
        
        if (!token) {
          this.errorMessage = 'Authentication token not found. Please login again.';
          this.isSubmitting = false;
          console.log('No token found, user needs to login');
          return;
        }

        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        };

        // Make API call
        console.log('=== API Call Debug ===');
        console.log('URL:', 'http://localhost:8080/api/npa');
        console.log('Headers:', headers);
        console.log('Payload:', JSON.stringify(payload, null, 2));
        
        this.http.post<any>('http://localhost:8080/api/npa', payload, { headers })
          .subscribe({
            next: (response) => {
              console.log('=== API Response Debug ===');
              console.log('Raw response:', response);
              console.log('Response type:', typeof response);
              console.log('Response keys:', Object.keys(response || {}));
              
              this.isSubmitting = false;
              
              // Extract NPA ID from response with better debugging
              const possibleIdKeys = ['id', 'npaId', 'npa_id', 'NPA_ID', 'Id', 'ID'];
              let foundId = 'N/A';
              
              for (const key of possibleIdKeys) {
                if (response && response[key] !== undefined) {
                  foundId = response[key];
                  console.log(`Found ID in key '${key}':`, foundId);
                  break;
                }
              }
              
              // Check nested objects
              if (foundId === 'N/A' && response) {
                for (const key of Object.keys(response)) {
                  if (typeof response[key] === 'object' && response[key] !== null) {
                    for (const subKey of possibleIdKeys) {
                      if (response[key][subKey] !== undefined) {
                        foundId = response[key][subKey];
                        console.log(`Found ID in nested object '${key}.${subKey}':`, foundId);
                        break;
                      }
                    }
                    if (foundId !== 'N/A') break;
                  }
                }
              }
              
              this.npaId = foundId;
              console.log('Final NPA ID:', this.npaId);
              
              if (this.npaId !== 'N/A') {
                this.showModal = true;
                console.log('Modal should be showing now');
                console.log('showModal value set to:', this.showModal);
                
                // Force change detection to ensure modal shows
                setTimeout(() => {
                  this.cdr.detectChanges();
                  console.log('Change detection forced, showModal is now:', this.showModal);
                }, 0);
              } else {
                this.errorMessage = 'NPA created but could not extract ID. Response: ' + JSON.stringify(response);
                console.error('Could not extract NPA ID from response');
                this.cdr.detectChanges();
              }
              
              console.log('NPA creation process completed');
            },
            error: (error) => {
              console.log('=== API Error Debug ===');
              console.error('Full error object:', error);
              console.error('Error status:', error.status);
              console.error('Error statusText:', error.statusText);
              console.error('Error message:', error.message);
              console.error('Error error:', error.error);
              
              this.isSubmitting = false;
              
              // Better error message extraction
              let errorMessage = 'Failed to create NPA. Please try again.';
              
              if (error.error && typeof error.error === 'string') {
                errorMessage = error.error;
              } else if (error.error && error.error.message) {
                errorMessage = error.error.message;
              } else if (error.message) {
                errorMessage = error.message;
              } else if (error.status) {
                errorMessage = `Server error (${error.status}): ${error.statusText || 'Unknown error'}`;
              }
              
              this.errorMessage = errorMessage;
              console.error('Final error message:', errorMessage);
              this.cdr.detectChanges();
            }
          });
      } else {
        console.log('Please fill in all mandatory fields marked with *');
        console.log('Form valid:', this.borrowerDetails.form.valid);
        console.log('Form errors:', this.borrowerDetails.form.errors);
        console.log('Form dirty:', this.borrowerDetails.form.dirty);
        console.log('Form touched:', this.borrowerDetails.form.touched);
      }
    } else {
      console.log('Form reference not available');
    }
  }

  private logEntityClassSuggestion(data: BasicDetailsOfTheBorrower): void {
    const entityClass = `/**
 * Basic Details of the Borrower Entity
 * Import from: src/app/interface/basic-details-of-borrower.ts
 */
export interface BasicDetailsOfTheBorrower {
  divisionName: string;
  regionalOffice: string;
  accountName: string;
  npaClassificationDate: string; // Format: YYYY-MM-DD
  businessActivity: string;
  registeredAddress: string;
  corporateOffice: string;
  factoryAddress: string;
  factoryRunningCondition: 'yes' | 'no';
  factoryNotRunningSince?: string;
  factoryLeasedOut: 'yes' | 'no';
  lesseeName?: string;
  lesseeContactDetails?: string;
  boardMembers: BoardMember[];
}

export interface BoardMember {
  name: string;
  designation: string;
  contactDetails: string;
  address: string;
}
`;
    console.log(entityClass);
  }

  closeModal(): void {
    console.log('closeModal called, current showModal:', this.showModal);
    this.showModal = false;
    this.cdr.detectChanges();
    console.log('closeModal completed, showModal is now:', this.showModal);
  }

  navigateToNpaDetail(): void {
    console.log('navigateToNpaDetail called with NPA ID:', this.npaId);
    this.closeModal();
    if (this.npaId && this.npaId !== 'N/A') {
      console.log('Navigating to NPA detail page...');
      // Fix: Use correct dashboard route path
      this.router.navigate(['/dashboard/npa-detail', this.npaId]);
    } else {
      console.error('Cannot navigate: Invalid NPA ID:', this.npaId);
    }
  }

  navigateToNpaList(): void {
    console.log('navigateToNpaList called');
    this.closeModal();
    // Fix: Use correct dashboard route path
    this.router.navigate(['/dashboard/all-npa']);
  }
}
