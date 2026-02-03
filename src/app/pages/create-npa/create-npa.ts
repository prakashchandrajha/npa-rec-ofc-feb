import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NpaFormComponent } from '../../components/parent/npa-form/npa-form.component';

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
  imports: [RouterModule, NpaFormComponent],
  templateUrl: './create-npa.html',
  styleUrl: './create-npa.css',
})
export class CreateNpa {
  
}
