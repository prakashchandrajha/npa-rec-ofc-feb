import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RepaymentScheduleService } from '../../../services/sections/repayment-schedule.service';

@Component({
  selector: 'app-repayment-schedule',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './repayment-schedule.component.html',
  styles: [`
    /* Original Repayment Schedule Component Styles */
  `]
})
export class RepaymentScheduleComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private repaymentService: RepaymentScheduleService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      schedules: this.fb.array([])
    });
    this.addSchedule();
  }

  get schedules(): FormArray {
    return this.form.get('schedules') as FormArray;
  }

  private createScheduleGroup(): FormGroup {
    const srNo = this.schedules.length + 1;
    return this.fb.group({
      srNo: [srNo],
      installmentDate: [''],
      installmentAmount: [null],
      dateOfActualReceipt: ['']
    });
  }

  addSchedule(): void {
    this.schedules.push(this.createScheduleGroup());
  }

  removeSchedule(index: number): void {
    if (this.schedules.length > 1) {
      this.schedules.removeAt(index);
      this.updateSerialNumbers();
    }
  }

  private updateSerialNumbers(): void {
    this.schedules.controls.forEach((control, idx) => {
      control.get('srNo')?.setValue(idx + 1);
    });
  }
}
