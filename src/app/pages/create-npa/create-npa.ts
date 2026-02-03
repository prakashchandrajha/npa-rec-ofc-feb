import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Sidebar } from '../../components/sidebar/sidebar';
import { ContentViewPage } from '../../components/content-view-page/content-view-page';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Npa {
  accountNumber: string;
  accountType: string;
  customerName: string;
  customerId: string;
  contactNumber: string;
  npaDate: string;
  npaCategory: string;
  outstandingPrincipal: number;
  interestDue: number;
  totalAmountDue: number;
  remarks: string;
}

@Component({
  selector: 'app-create-npa',
  imports: [RouterModule, Sidebar, ContentViewPage,FormsModule],
  templateUrl: './create-npa.html',
  styleUrl: './create-npa.css',
})
export class CreateNpa {
  npa: Npa = {
    accountNumber: '',
    accountType: '',
    customerName: '',
    customerId: '',
    contactNumber: '',
    npaDate: '',
    npaCategory: '',
    outstandingPrincipal: 0,
    interestDue: 0,
    totalAmountDue: 0,
    remarks: ''
  };

  onSubmit(): void {
    console.log('NPA Form Submitted:', this.npa);
    // Here you would typically call a service to save the NPA data
    alert('NPA created successfully!\n\n' + JSON.stringify(this.npa, null, 2));
    this.resetForm();
  }

  resetForm(): void {
    this.npa = {
      accountNumber: '',
      accountType: '',
      customerName: '',
      customerId: '',
      contactNumber: '',
      npaDate: '',
      npaCategory: '',
      outstandingPrincipal: 0,
      interestDue: 0,
      totalAmountDue: 0,
      remarks: ''
    };
  }
}