import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-basic-details-of-the-borrower-01',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './basic-details-of-the-borrower-01.component.html',
  styles: [`
    /* Basic Details Component Styles */
  `]
})
export class BasicDetailsOfTheBorrower01Component implements OnInit {
  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      // Only these two fields are mandatory
      divisionName: ['', Validators.required],
      regionalOffice: [''],
      
      // b. Name of Account and date of classification as NPA
      accountName: [''],
      npaClassificationDate: ['', Validators.required],
      
      // c. Business Activity of the society
      businessActivity: [''],
      
      // d. Contact Details (Board Members) - handled via FormArray
      
      // e. Registered Address, Corporate office, Factory Address
      registeredAddress: [''],
      corporateOffice: [''],
      factoryAddress: [''],
      
      // f. Whether Factory/Mill is in running condition
      factoryRunningCondition: [''],
      factoryNotRunningSince: [''],
      
      // g. Whether Factory/Mill is leased out/ rented
      factoryLeasedOut: [''],
      lesseeName: [''],
      lesseeContactDetails: [''],
      
      // Board Members
      boardMembers: this.fb.array([])
    });
    this.addMember(); // Add one row by default
  }

  get boardMembers(): FormArray {
    return this.form.get('boardMembers') as FormArray;
  }

  addMember(): void {
    this.boardMembers.push(this.fb.group({
      name: [''],
      designation: [''],
      contactDetails: [''],
      address: ['']
    }));
  }

  removeMember(index: number): void {
    this.boardMembers.removeAt(index);
  }
}
