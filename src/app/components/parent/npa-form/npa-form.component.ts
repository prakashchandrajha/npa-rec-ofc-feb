import { Component, ViewChild, AfterViewInit, ChangeDetectorRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NpaService } from '../../../services/npa.service';
import { BasicDetailsOfTheBorrower01Component } from '../../child/basic-details-of-the-borrower-01/basic-details-of-the-borrower-01.component';
import { FacilitySanctionedComponent } from '../../child/facility-sanctioned/facility-sanctioned.component';
import { SecurityDetailsComponent } from '../../child/security-details/security-details.component';
import { ReleaseDetailsComponent } from '../../child/release-details/release-details.component';
import { PostDatedChequesDetailsComponent } from '../../child/post-dated-cheques-details/post-dated-cheques-details.component';
import { RepaymentScheduleComponent } from '../../child/repayment-schedule/repayment-schedule.component';
import { RestructuringDetailsComponent } from '../../child/restructuring-details/restructuring-details.component';
import { CorrespondenceComponent } from '../../child/correspondence/correspondence.component';
import { RevisedRepaymentScheduleComponent } from '../../child/revised-repayment-schedule/revised-repayment-schedule.component';

/**
 * Parent NPA Form Component - Refactored Version
 * 
 * Features:
 * - Signal-based state management
 * - Cleaner validation and data collection
 * - Better error handling
 * - Modern Angular control flow
 */
@Component({
  selector: 'app-npa-form',
  standalone: true,
  imports: [
    CommonModule,
    BasicDetailsOfTheBorrower01Component,
    FacilitySanctionedComponent,
    SecurityDetailsComponent,
    ReleaseDetailsComponent,
    PostDatedChequesDetailsComponent,
    RepaymentScheduleComponent,
    RestructuringDetailsComponent,
    CorrespondenceComponent,
    RevisedRepaymentScheduleComponent
  ],
  templateUrl: './npa-form.component.html',
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
    
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.9); }
      to { opacity: 1; transform: scale(1); }
    }
    .animate-scaleIn { animation: scaleIn 0.3s ease-out; }
    
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
    .animate-shake { animation: shake 0.3s ease-in-out; }
  `]
})
export class NpaFormComponent implements AfterViewInit {
  // Child component references
  @ViewChild(BasicDetailsOfTheBorrower01Component) borrowerDetails!: BasicDetailsOfTheBorrower01Component;
  @ViewChild(FacilitySanctionedComponent) facilitySanctioned!: FacilitySanctionedComponent;
  @ViewChild(SecurityDetailsComponent) securityDetails!: SecurityDetailsComponent;
  @ViewChild(ReleaseDetailsComponent) releaseDetails!: ReleaseDetailsComponent;
  @ViewChild(PostDatedChequesDetailsComponent) postDatedChequesDetails!: PostDatedChequesDetailsComponent;
  @ViewChild(RepaymentScheduleComponent) repaymentSchedule!: RepaymentScheduleComponent;
  @ViewChild(RestructuringDetailsComponent) restructuringDetails!: RestructuringDetailsComponent;
  @ViewChild(CorrespondenceComponent) correspondence!: CorrespondenceComponent;
  @ViewChild(RevisedRepaymentScheduleComponent) revisedSchedule!: RevisedRepaymentScheduleComponent;

  // Signal-based state
  readonly showModal = signal<boolean>(false);
  readonly isSubmitting = signal<boolean>(false);
  readonly errorMessage = signal<string>('');
  
  npaId = '';

  constructor(
    private npaService: NpaService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    // Child components are now available
  }

  /**
   * Validate all form sections
   */
  private validateAllSections(): boolean {
    // Validate Basic Details section (mandatory)
    if (this.borrowerDetails?.form && !this.borrowerDetails.form.valid) {
      this.errorMessage.set('Please fill in all mandatory fields in Basic Details section');
      this.borrowerDetails.form.markAllAsTouched();
      return false;
    }
    return true;
  }

  /**
   * Collect data from all form sections and build payload
   */
  private collectFormData(): any {
    const sections: any = {};

    // Collect from each section if available
    if (this.borrowerDetails?.form) {
      sections.basicDetails = this.borrowerDetails.form.value;
    }
    if (this.facilitySanctioned?.form) {
      sections.facilitySanctioned = this.facilitySanctioned.form.value;
    }
    if (this.securityDetails?.form) {
      sections.securityDetails = this.securityDetails.form.value;
    }
    if (this.releaseDetails?.form) {
      sections.releaseDetails = this.releaseDetails.form.value;
    }
    if (this.postDatedChequesDetails?.form) {
      sections.postDatedChequesDetails = this.postDatedChequesDetails.form.value;
    }
    if (this.repaymentSchedule?.form) {
      sections.repaymentSchedule = this.repaymentSchedule.form.value;
    }
    if (this.restructuringDetails?.form) {
      sections.restructuringDetails = this.restructuringDetails.form.value;
    }
    if (this.revisedSchedule?.form) {
      sections.revisedRepaymentSchedule = this.revisedSchedule.form.value;
    }
    if (this.correspondence?.form) {
      sections.correspondence = this.correspondence.form.value;
    }

    return this.npaService.buildPayload(sections);
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    this.errorMessage.set('');

    if (!this.validateAllSections()) {
      return;
    }

    this.isSubmitting.set(true);
    const payload = this.collectFormData();

    this.npaService.createNpa(payload).subscribe({
      next: (response) => {
        this.isSubmitting.set(false);
        
        // Extract NPA ID from response
        const possibleIdKeys = ['id', 'npaId', 'npa_id', 'NPA_ID', 'Id', 'ID'];
        let foundId = 'N/A';
        
        for (const key of possibleIdKeys) {
          if (response && (response as any)[key] !== undefined) {
            foundId = (response as any)[key];
            break;
          }
        }
        
        this.npaId = foundId.toString();
        
        if (this.npaId !== 'N/A') {
          this.showModal.set(true);
          this.cdr.detectChanges();
        } else {
          this.errorMessage.set('NPA created but could not extract ID.');
        }
      },
      error: (error) => {
        this.isSubmitting.set(false);
        
        let errorMsg = 'Failed to create NPA. Please try again.';
        
        if (error.error && typeof error.error === 'string') {
          errorMsg = error.error;
        } else if (error.error?.message) {
          errorMsg = error.error.message;
        } else if (error.message) {
          errorMsg = error.message;
        } else if (error.status) {
          errorMsg = `Server error (${error.status}): ${error.statusText || 'Unknown error'}`;
        }
        
        this.errorMessage.set(errorMsg);
        this.cdr.detectChanges();
      }
    });
  }

  closeModal(): void {
    this.showModal.set(false);
    this.cdr.detectChanges();
  }

  navigateToNpaDetail(): void {
    this.closeModal();
    if (this.npaId && this.npaId !== 'N/A') {
      this.router.navigate(['/dashboard/npa-detail', this.npaId]);
    }
  }

  navigateToNpaList(): void {
    this.closeModal();
    this.router.navigate(['/dashboard/all-npa']);
  }
}
