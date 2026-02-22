import { Component, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { BasicDetailsOfTheBorrower01Component } from '../../child/basic-details-of-the-borrower-01/basic-details-of-the-borrower-01.component';
import { FacilitySanctionedComponent } from '../../child/facility-sanctioned/facility-sanctioned.component';
import { SecurityDetailsComponent } from '../../child/security-details/security-details.component';
import { ReleaseDetailsComponent } from '../../child/release-details/release-details.component';
import { PostDatedChequesDetailsComponent } from '../../child/post-dated-cheques-details/post-dated-cheques-details.component';
import { RepaymentScheduleComponent } from '../../child/repayment-schedule/repayment-schedule.component';
import { RestructuringDetailsComponent } from '../../child/restructuring-details/restructuring-details.component';
import { CorrespondenceComponent } from '../../child/correspondence/correspondence.component';
import { RevisedRepaymentScheduleComponent } from '../../child/revised-repayment-schedule/revised-repayment-schedule.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NpaService } from '../../../services/npa.service';

/**
 * Parent NPA Form Component
 * 
 * This component orchestrates all child form sections:
 * - BasicDetailsOfTheBorrower01Component (Section 1)
 * - FacilitySanctionedComponent (Section 2)
 * - SecurityDetailsComponent (Section 3)
 * - ReleaseDetailsComponent (Section 6)
 * - PostDatedChequesDetailsComponent (Section 7)
 * - More sections will be added in the future
 * 
 * Architecture:
 * - Each child component has its own form and validation
 * - Each section has its own service (accessed via NpaService)
 * - NpaService.buildPayload() collects data from all sections
 * - Clean separation of concerns for scalability
 */
@Component({
  selector: 'app-npa-form',
  standalone: true,
  imports: [
    BasicDetailsOfTheBorrower01Component, 
    FacilitySanctionedComponent,
    SecurityDetailsComponent,
    ReleaseDetailsComponent,
    PostDatedChequesDetailsComponent,
    RepaymentScheduleComponent,
    RestructuringDetailsComponent,
    CorrespondenceComponent,
    RevisedRepaymentScheduleComponent,
    CommonModule
  ],
  templateUrl: './npa-form.component.html',
  styles: [`
    /* NPA Form Component Styles */
  `]
})
export class NpaFormComponent implements AfterViewInit {
  // Section 1: Basic Details of the Borrower
  @ViewChild(BasicDetailsOfTheBorrower01Component) borrowerDetails!: BasicDetailsOfTheBorrower01Component;
  
  // Section 2: Facility Sanctioned
  @ViewChild(FacilitySanctionedComponent) facilitySanctioned!: FacilitySanctionedComponent;
  
  // Section 3: Security Details
  @ViewChild(SecurityDetailsComponent) securityDetails!: SecurityDetailsComponent;
  
  // Section 6: Release Details
  @ViewChild(ReleaseDetailsComponent) releaseDetails!: ReleaseDetailsComponent;
  
  // Section 7: Post Dated Cheques Details
  @ViewChild(PostDatedChequesDetailsComponent) postDatedChequesDetails!: PostDatedChequesDetailsComponent;

  // Section 8: Original Repayment Schedule (non mandatory)
  @ViewChild(RepaymentScheduleComponent) repaymentSchedule!: RepaymentScheduleComponent;

  // Section 9: Restructuring details
  @ViewChild(RestructuringDetailsComponent) restructuringDetails!: RestructuringDetailsComponent;

  // Section 13: Correspondence
  @ViewChild(CorrespondenceComponent) correspondence!: CorrespondenceComponent;

  // Section 10: Revised Repayment Schedule
  @ViewChild(RevisedRepaymentScheduleComponent) revisedSchedule!: RevisedRepaymentScheduleComponent;
  
  // Future child components will be added here:
  // @ViewChild(GuarantorDetailsComponent) guarantorDetails!: GuarantorDetailsComponent;
  
  showModal: boolean = false;
  npaId: string = '';
  isSubmitting: boolean = false;
  errorMessage: string = '';

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
   * @returns true if all sections are valid
   */
  private validateAllSections(): boolean {
    let isValid = true;

    // Validate Basic Details section (Section 1)
    if (this.borrowerDetails && this.borrowerDetails.form) {
      if (!this.npaService.basicDetails.validate(this.borrowerDetails.form)) {
        isValid = false;
      }
    }

    // Other sections are optional - no mandatory validation

    return isValid;
  }

  /**
   * Collect data from all form sections and build payload
   * @returns Complete NPA payload
   */
  private collectFormData(): any {
    const sections: any = {};

    // Collect Basic Details (Section 1)
    if (this.borrowerDetails && this.borrowerDetails.form) {
      sections.basicDetails = this.borrowerDetails.form.value;
    }

    // Collect Facility Sanctioned (Section 2)
    if (this.facilitySanctioned && this.facilitySanctioned.form) {
      sections.facilitySanctioned = this.facilitySanctioned.form.value;
    }

    // Collect Security Details (Section 3)
    if (this.securityDetails && this.securityDetails.form) {
      sections.securityDetails = this.securityDetails.form.value;
    }

    // Collect Release Details (Section 6)
    if (this.releaseDetails && this.releaseDetails.form) {
      sections.releaseDetails = this.releaseDetails.form.value;
    }

    // Collect Post Dated Cheques Details (Section 7)
    if (this.postDatedChequesDetails && this.postDatedChequesDetails.form) {
      sections.postDatedChequesDetails = this.postDatedChequesDetails.form.value;
    }

    // Collect Original Repayment Schedule (Section 8) - optional
    if (this.repaymentSchedule && this.repaymentSchedule.form) {
      sections.repaymentSchedule = this.repaymentSchedule.form.value;
    }

  // Collect Restructuring Details (Section 9) - optional
    if (this.restructuringDetails && this.restructuringDetails.form) {
      sections.restructuringDetails = this.restructuringDetails.form.value;
    }

    // Collect revised repayment schedule (Section 10)
    if (this.revisedSchedule && this.revisedSchedule.form) {
      sections.revisedRepaymentSchedule = this.revisedSchedule.form.value;
    }

    // Collect correspondence records (Section 13)
    if (this.correspondence && this.correspondence.form) {
      sections.correspondence = this.correspondence.form.value;
    }

    // Use NpaService to build the complete payload
    return this.npaService.buildPayload(sections);
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    // Validate all sections
    if (!this.validateAllSections()) {
      this.errorMessage = 'Please fill in all mandatory fields';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    // Collect and transform data from all sections
    const payload = this.collectFormData();

    // Submit to API
    this.npaService.createNpa(payload).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        
        // Extract NPA ID from response
        const possibleIdKeys = ['id', 'npaId', 'npa_id', 'NPA_ID', 'Id', 'ID'];
        let foundId = 'N/A';
        
        for (const key of possibleIdKeys) {
          if (response && (response as any)[key] !== undefined) {
            foundId = (response as any)[key];
            break;
          }
        }
        
        this.npaId = foundId;
        
        if (this.npaId !== 'N/A') {
          this.showModal = true;
          setTimeout(() => this.cdr.detectChanges(), 0);
        } else {
          this.errorMessage = 'NPA created but could not extract ID. Response: ' + JSON.stringify(response);
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        
        let errorMessage = 'Failed to create NPA. Please try again.';
        
        if (error.error && typeof error.error === 'string') {
          errorMessage = error.error;
        } else if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        } else if (error.status) {
          errorMessage = `Server error (${error.status}): ${error.statusText || 'Unknown error'}`;
        }
        
        this.errorMessage = errorMessage;
        this.cdr.detectChanges();
      }
    });
  }

  closeModal(): void {
    this.showModal = false;
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
