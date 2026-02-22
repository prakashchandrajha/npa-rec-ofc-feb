import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReleaseDetailsService } from '../../../services/sections/release-details.service';

@Component({
  selector: 'app-release-details',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './release-details.component.html',
  styles: [`
    /* Release Details Component Styles */
  `]
})
export class ReleaseDetailsComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private releaseDetailsService: ReleaseDetailsService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      releases: this.fb.array([])
    });

    // Initialize with 1 empty row
    this.addRelease();
  }

  /**
   * Get releases FormArray
   */
  get releases(): FormArray {
    return this.form.get('releases') as FormArray;
  }

  /**
   * Create a release form group
   */
  private createReleaseFormGroup(): FormGroup {
    return this.fb.group({
      srNo: [this.releases.length + 1],
      dateOfRelease: [''],
      againstReleaseLetter: [''],
      amount: [null]
    });
  }

  /**
   * Add a new release row
   */
  addRelease(): void {
    this.releases.push(this.createReleaseFormGroup());
  }

  /**
   * Remove a release row
   */
  removeRelease(index: number): void {
    if (this.releases.length > 1) {
      this.releases.removeAt(index);
      this.updateSerialNumbers();
    }
  }

  /**
   * Update serial numbers after removal
   */
  private updateSerialNumbers(): void {
    this.releases.controls.forEach((control, index) => {
      control.get('srNo')?.setValue(index + 1);
    });
  }
}
