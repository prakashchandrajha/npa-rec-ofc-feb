import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { BasicDetailsOfTheBorrower01Component } from '../../child/basic-details-of-the-borrower-01/basic-details-of-the-borrower-01.component';

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
        console.log('Form submitted successfully:', this.borrowerDetails.form.value);
        // Add your form submission logic here
        alert('Form submitted successfully!');
      } else {
        console.log('Please fill in all mandatory fields marked with *');
      }
    } else {
      console.log('Form reference not available');
    }
  }
}
