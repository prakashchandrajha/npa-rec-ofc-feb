import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PostDatedChequesDetailsService } from '../../../services/sections/post-dated-cheques-details.service';

@Component({
  selector: 'app-post-dated-cheques-details',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './post-dated-cheques-details.component.html',
  styles: [`
    /* Post Dated Cheques Details Component Styles */
  `]
})
export class PostDatedChequesDetailsComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private pdcDetailsService: PostDatedChequesDetailsService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      pdcAvailable: [''],
      numberOfPDCAvailable: [''],
      pdcPresentedInBank: [''],
      pdcNotPresentedReason: [''],
      pdcDishonored: [''],
      checkReturnMemoDate: [''],
      legalNoticeIssued: [''],
      legalNoticeDate: [''],
      caseFiledUnder138: [''],
      caseFilingDate: [''],
      caseNumber: [''],
      presentStatus: [''],
      caseNotFiledReason: ['']
    });
  }
}
