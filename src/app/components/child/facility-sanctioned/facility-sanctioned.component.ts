import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FacilitySanctionedService } from '../../../services/sections/facility-sanctioned.service';

@Component({
  selector: 'app-facility-sanctioned',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './facility-sanctioned.component.html',
  styles: [`
    /* Facility Sanctioned Component Styles */
  `]
})
export class FacilitySanctionedComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private facilitySanctionedService: FacilitySanctionedService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      facilities: this.fb.array([])
    });

    // Initialize with default facility types
    this.initializeDefaultFacilities();
  }

  /**
   * Initialize facilities with default types (Term Loan, Working Capital, empty row)
   */
  private initializeDefaultFacilities(): void {
    const defaultTypes = this.facilitySanctionedService.getDefaultFacilityTypes();
    defaultTypes.forEach((type, index) => {
      this.addFacility(type);
    });
  }

  /**
   * Get facilities FormArray
   */
  get facilities(): FormArray {
    return this.form.get('facilities') as FormArray;
  }

  /**
   * Create a facility form group
   */
  private createFacilityFormGroup(nameOfFacility: string = ''): FormGroup {
    return this.fb.group({
      srNo: [this.facilities.length + 1],
      nameOfFacility: [nameOfFacility],
      tenorOfFacility: [''],
      amount: [null],
      dateOfSanction: [''],
      sanctionReferenceNo: [''],
      documentationDate: [''],
      disbursedAmount: [null],
      outstandingAmount: [null],
      bankingArrangements: ['']
    });
  }

  /**
   * Add a new facility row
   */
  addFacility(nameOfFacility: string = ''): void {
    this.facilities.push(this.createFacilityFormGroup(nameOfFacility));
  }

  /**
   * Remove a facility row
   */
  removeFacility(index: number): void {
    if (this.facilities.length > 1) {
      this.facilities.removeAt(index);
      // Update serial numbers
      this.updateSerialNumbers();
    }
  }

  /**
   * Update serial numbers after removal
   */
  private updateSerialNumbers(): void {
    this.facilities.controls.forEach((control, index) => {
      control.get('srNo')?.setValue(index + 1);
    });
  }
}
