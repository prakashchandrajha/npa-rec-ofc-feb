import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RestructuringDetailsService } from '../../../services/sections/restructuring-details.service';

@Component({
  selector: 'app-restructuring-details',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './restructuring-details.component.html',
  styles: [`
    /* Restructuring Details Styles */
  `]
})
export class RestructuringDetailsComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private restructuringService: RestructuringDetailsService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      restructured: [''],
      restructuringDate: [''],
      referenceNo: [''],
      restructuringTerm: [''],
      nonRepaymentNonCompliance: [''],
    });
  }

  get revisedSchedules(): FormArray {
    return this.form.get('revisedSchedules') as FormArray;
  }

  private createScheduleGroup(): FormGroup {
    const srNo = this.revisedSchedules.length + 1;
    return this.fb.group({
      srNo: [srNo],
      installmentDate: [''],
      installmentAmount: [null],
      dateOfActualReceipt: ['']
    });
  }

  addSchedule(): void {
  }

  removeSchedule(index: number): void {
    // no schedule rows in this component
  }

  private updateSerials(): void {
    // not applicable
  }
}
