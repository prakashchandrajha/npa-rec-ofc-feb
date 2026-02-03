import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { BasicDetailsOfTheBorrower01Component } from '../../child/basic-details-of-the-borrower-01/basic-details-of-the-borrower-01.component';
import { BasicDetailsOfTheBorrower } from '../../../interface/basic-details-of-borrower';

@Component({
  selector: 'app-npa-form',
  imports: [BasicDetailsOfTheBorrower01Component],
  templateUrl: './npa-form.component.html',
  styleUrl: './npa-form.component.css'
})
export class NpaFormComponent implements AfterViewInit {
  @ViewChild(BasicDetailsOfTheBorrower01Component) borrowerDetails!: BasicDetailsOfTheBorrower01Component;

  ngAfterViewInit(): void {
    // Child component is now available
  }

  onSubmit(): void {
    if (this.borrowerDetails && this.borrowerDetails.form) {
      // Mark all fields as touched to show validation errors
      this.borrowerDetails.form.markAllAsTouched();
      
      if (this.borrowerDetails.form.valid) {
        const formData = this.borrowerDetails.form.value;
        
        // Log form data in a structured format for backend developers
        console.log('%c=== NPA Form Submission ===', 'color: #4CAF50; font-weight: bold; font-size: 14px;');
        console.log('%cForm Data:', 'color: #2196F3; font-weight: bold;');
        console.log(formData);
        
        // Log as JSON string for easy copying
        console.log('%cJSON Format:', 'color: #FF9800; font-weight: bold;');
        console.log(JSON.stringify(formData, null, 2));
        
        // Log entity class suggestion for backend
        console.log('%cSuggested Backend Entity Class (TypeScript):', 'color: #9C27B0; font-weight: bold;');
        this.logEntityClassSuggestion(formData);
        
        // Add your form submission logic here
        alert('Form submitted successfully!');
      } else {
        console.log('Please fill in all mandatory fields marked with *');
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
}
