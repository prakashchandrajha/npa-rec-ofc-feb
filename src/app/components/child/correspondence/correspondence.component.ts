import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CorrespondenceService } from '../../../services/sections/correspondence.service';

@Component({
  selector: 'app-correspondence',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './correspondence.component.html',
  styles: [`
    /* Correspondence Component Styles */
  `]
})
export class CorrespondenceComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private correspondenceService: CorrespondenceService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      correspondences: this.fb.array([])
    });
    this.addRow();
  }

  get correspondences(): FormArray {
    return this.form.get('correspondences') as FormArray;
  }

  private createRow(): FormGroup {
    const srNo = this.correspondences.length + 1;
    return this.fb.group({
      srNo: [srNo],
      particulars: [''],
      date: [''],
      outcome: ['']
    });
  }

  addRow(): void {
    this.correspondences.push(this.createRow());
  }

  removeRow(index: number): void {
    if (this.correspondences.length > 1) {
      this.correspondences.removeAt(index);
      this.updateSerials();
    }
  }

  private updateSerials(): void {
    this.correspondences.controls.forEach((ctrl, idx) => {
      ctrl.get('srNo')?.setValue(idx + 1);
    });
  }
}
