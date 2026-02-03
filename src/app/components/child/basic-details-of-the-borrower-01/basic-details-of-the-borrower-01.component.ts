import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-basic-details-of-the-borrower-01',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './basic-details-of-the-borrower-01.component.html',
  styleUrl: './basic-details-of-the-borrower-01.component.css'
})
export class BasicDetailsOfTheBorrower01Component implements OnInit {
  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      // a. Name of Division and Regional Office
      divisionName: ['', Validators.required],
      regionalOffice: ['', Validators.required],
      
      // b. Name of Account and date of classification as NPA
      accountName: ['', Validators.required],
      npaClassificationDate: ['', Validators.required],
      
      // c. Business Activity of the society
      businessActivity: ['', Validators.required],
      
      // d. Contact Details (Board Members) - handled via FormArray
      
      // e. Registered Address, Corporate office, Factory Address
      registeredAddress: ['', Validators.required],
      corporateOffice: ['', Validators.required],
      factoryAddress: ['', Validators.required],
      
      // f. Whether Factory/Mill is in running condition
      factoryRunningCondition: ['', Validators.required],
      factoryNotRunningSince: [''],
      
      // g. Whether Factory/Mill is leased out/ rented
      factoryLeasedOut: ['', Validators.required],
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
      name: ['', Validators.required],
      designation: ['', Validators.required],
      contactDetails: ['', Validators.required],
      address: ['', Validators.required]
    }));
  }

  removeMember(index: number): void {
    this.boardMembers.removeAt(index);
  }
}
