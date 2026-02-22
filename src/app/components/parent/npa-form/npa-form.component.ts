import { Component, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { BasicDetailsOfTheBorrower01Component } from '../../child/basic-details-of-the-borrower-01/basic-details-of-the-borrower-01.component';
import { BasicDetailsOfTheBorrower } from '../../../interface/basic-details-of-borrower';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NpaService } from '../../../services/npa.service';

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

  constructor(
    private npaService: NpaService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

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
        
        const formData = this.borrowerDetails.form.value as BasicDetailsOfTheBorrower;

        this.npaService.createNpa(formData).subscribe({
          next: (response) => {
            this.isSubmitting = false;
            
            // Extract NPA ID from response
            const possibleIdKeys = ['id', 'npaId', 'npa_id', 'NPA_ID', 'Id', 'ID'];
            let foundId = 'N/A';
            
            for (const key of possibleIdKeys) {
              if (response && (response as any)[key] !== undefined) {
                foundId = (response as any)[key];
                break;
              }
            }
            
            this.npaId = foundId;
            
            if (this.npaId !== 'N/A') {
              this.showModal = true;
              setTimeout(() => this.cdr.detectChanges(), 0);
            } else {
              this.errorMessage = 'NPA created but could not extract ID. Response: ' + JSON.stringify(response);
              this.cdr.detectChanges();
            }
          },
          error: (error) => {
            this.isSubmitting = false;
            
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
            this.cdr.detectChanges();
          }
        });
      }
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.cdr.detectChanges();
  }

  navigateToNpaDetail(): void {
    this.closeModal();
    if (this.npaId && this.npaId !== 'N/A') {
      this.router.navigate(['/dashboard/npa-detail', this.npaId]);
    }
  }

  navigateToNpaList(): void {
    this.closeModal();
    this.router.navigate(['/dashboard/all-npa']);
  }
}
