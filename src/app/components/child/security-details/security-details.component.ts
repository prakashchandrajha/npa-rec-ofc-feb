import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SecurityDetailsService } from '../../../services/sections/security-details.service';

@Component({
  selector: 'app-security-details',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './security-details.component.html',
  styles: [`
    /* Security Details Component Styles */
  `]
})
export class SecurityDetailsComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private securityDetailsService: SecurityDetailsService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      securities: this.fb.array([]),
      valuation: this.fb.group({
        nameOfValuer: [''],
        dateOfReport: [''],
        fmv: [''],
        rv: [''],
        dsv: [''],
        guidelineGovtRate: ['']
      }),
      legalDocuments: this.fb.group({
        loanAgreementDate: [''],
        deedOfHypothecationDate: [''],
        boardResolutionDate: ['']
      })
    });

    // Initialize with 2 empty security rows
    this.addSecurity();
    this.addSecurity();
  }

  /**
   * Get securities FormArray
   */
  get securities(): FormArray {
    return this.form.get('securities') as FormArray;
  }

  /**
   * Get valuation FormGroup
   */
  get valuation(): FormGroup {
    return this.form.get('valuation') as FormGroup;
  }

  /**
   * Get legalDocuments FormGroup
   */
  get legalDocuments(): FormGroup {
    return this.form.get('legalDocuments') as FormGroup;
  }

  /**
   * Get dropdown options from service
   */
  get securityTypes(): string[] {
    return this.securityDetailsService.getSecurityTypes();
  }

  get assetTypes(): string[] {
    return this.securityDetailsService.getAssetTypes();
  }

  get chargeTypes(): string[] {
    return this.securityDetailsService.getChargeTypes();
  }

  /**
   * Create a security form group
   */
  private createSecurityFormGroup(): FormGroup {
    return this.fb.group({
      srNo: [this.securities.length + 1],
      typeOfSecurity: [''],
      typeOfAsset: [''],
      propertyDetails: [''],
      typeOfCharge: [''],
      chargeDetails: [''],
      chargeCreationDate: [''],
      freeFromEncumbrances: ['']
    });
  }

  /**
   * Add a new security row
   */
  addSecurity(): void {
    this.securities.push(this.createSecurityFormGroup());
  }

  /**
   * Remove a security row
   */
  removeSecurity(index: number): void {
    if (this.securities.length > 1) {
      this.securities.removeAt(index);
      this.updateSerialNumbers();
    }
  }

  /**
   * Update serial numbers after removal
   */
  private updateSerialNumbers(): void {
    this.securities.controls.forEach((control, index) => {
      control.get('srNo')?.setValue(index + 1);
    });
  }
}
