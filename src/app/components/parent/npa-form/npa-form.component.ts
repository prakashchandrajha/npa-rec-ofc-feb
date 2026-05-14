import { Component, ViewChild, AfterViewInit, ChangeDetectorRef, signal, Input, OnInit } from '@angular/core';
import { FormBuilder, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NpaService } from '../../../services/npa.service';
import { NpaDraftService } from '../../../services/npa-draft.service';
import { BasicDetailsOfTheBorrower01Component } from '../../child/basic-details-of-the-borrower-01/basic-details-of-the-borrower-01.component';
import { FacilitySanctionedComponent } from '../../child/facility-sanctioned/facility-sanctioned.component';
import { SecurityDetailsComponent } from '../../child/security-details/security-details.component';
import { ReleaseDetailsComponent } from '../../child/release-details/release-details.component';
import { PostDatedChequesDetailsComponent } from '../../child/post-dated-cheques-details/post-dated-cheques-details.component';
import { RepaymentScheduleComponent } from '../../child/repayment-schedule/repayment-schedule.component';
import { RestructuringDetailsComponent } from '../../child/restructuring-details/restructuring-details.component';
import { CorrespondenceComponent } from '../../child/correspondence/correspondence.component';
import { RevisedRepaymentScheduleComponent } from '../../child/revised-repayment-schedule/revised-repayment-schedule.component';
import { BasicDetailsService } from '../../../services/sections/basic-details.service';
import { FacilitySanctionedService } from '../../../services/sections/facility-sanctioned.service';
import { SecurityDetailsService } from '../../../services/sections/security-details.service';
import { ReleaseDetailsService } from '../../../services/sections/release-details.service';
import { PostDatedChequesDetailsService } from '../../../services/sections/post-dated-cheques-details.service';
import { RepaymentScheduleService } from '../../../services/sections/repayment-schedule.service';
import { RestructuringDetailsService } from '../../../services/sections/restructuring-details.service';
import { CorrespondenceService } from '../../../services/sections/correspondence.service';
import { RevisedRepaymentScheduleService } from '../../../services/sections/revised-repayment-schedule.service';

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
export class NpaFormComponent implements AfterViewInit, OnInit {
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

  @Input() draftId: number | null = null;

  // Signal-based state
  readonly showModal = signal<boolean>(false);
  readonly isSubmitting = signal<boolean>(false);
  readonly isSavingDraft = signal<boolean>(false);
  readonly isLoadingDraft = signal<boolean>(false);
  readonly errorMessage = signal<string>('');
  
  npaId = '';

  constructor(
    private fb: FormBuilder,
    private npaService: NpaService,
    private draftService: NpaDraftService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private basicDetailsService: BasicDetailsService,
    private facilitySanctionedService: FacilitySanctionedService,
    private securityDetailsService: SecurityDetailsService,
    private releaseDetailsService: ReleaseDetailsService,
    private postDatedChequesDetailsService: PostDatedChequesDetailsService,
    private repaymentScheduleService: RepaymentScheduleService,
    private restructuringDetailsService: RestructuringDetailsService,
    private correspondenceService: CorrespondenceService,
    private revisedRepaymentScheduleService: RevisedRepaymentScheduleService
  ) {}

  ngOnInit(): void {
    // Draft loading moved to ngAfterViewInit to ensure ViewChild components are available
  }

  ngAfterViewInit(): void {
    // Child components are now available, load draft if needed
    if (this.draftId) {
      this.loadDraft();
    }
  }

  /**
   * Load draft data and populate the form
   */
  private loadDraft(): void {
    if (!this.draftId) return;
    
    this.isLoadingDraft.set(true);
    this.draftService.getDraftById(this.draftId).subscribe({
      next: (draft) => {
        this.isLoadingDraft.set(false);
        console.log('Draft loaded:', draft);
        this.populateFormWithDraft(draft);
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.isLoadingDraft.set(false);
        this.errorMessage.set('Failed to load draft. Please try again.');
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Populate form with draft data
   * Uses transformFromApi() to convert API-format data back to form format
   */
  private populateFormWithDraft(draft: any): void {
    console.log('Starting draft population...');
    if (!draft || !draft.draftData) {
      console.warn('No draft data available to populate form');
      return;
    }

    const data = draft.draftData;
    console.log('Draft data:', data);

    // Check if child components are available
    console.log('Child component availability:');
    console.log('borrowerDetails:', !!this.borrowerDetails);
    console.log('facilitySanctioned:', !!this.facilitySanctioned);
    console.log('securityDetails:', !!this.securityDetails);
    console.log('releaseDetails:', !!this.releaseDetails);
    console.log('postDatedChequesDetails:', !!this.postDatedChequesDetails);
    console.log('repaymentSchedule:', !!this.repaymentSchedule);
    console.log('restructuringDetails:', !!this.restructuringDetails);
    console.log('correspondence:', !!this.correspondence);
    console.log('revisedSchedule:', !!this.revisedSchedule);

    // Populate each section with error handling
    // Note: We use transformFromApi() to convert API-format data back to form format
    // because draft data is stored in API format (via buildPayload/transformToPayload)
    try {
      if (data?.basicDetails && this.borrowerDetails?.form) {
        console.log('Populating basic details:', data.basicDetails);
        this.populateBasicDetails(data.basicDetails);
      }
      if (data?.facilitySanctioned && this.facilitySanctioned?.form) {
        console.log('Populating facility sanctioned:', data.facilitySanctioned);
        this.populateFacilitySanctioned(data.facilitySanctioned);
      }
      if (data?.securityDetails && this.securityDetails?.form) {
        console.log('Populating security details:', data.securityDetails);
        this.populateSecurityDetails(data.securityDetails);
      }
      if (data?.releaseDetails && this.releaseDetails?.form) {
        console.log('Populating release details:', data.releaseDetails);
        this.populateReleaseDetails(data.releaseDetails);
      }
      if (data?.postDatedChequesDetails && this.postDatedChequesDetails?.form) {
        console.log('Populating post dated cheques:', data.postDatedChequesDetails);
        this.postDatedChequesDetails.form.patchValue(data.postDatedChequesDetails);
      }
      if (data?.repaymentSchedule && this.repaymentSchedule?.form) {
        console.log('Populating repayment schedule:', data.repaymentSchedule);
        this.populateRepaymentSchedule(data.repaymentSchedule);
      }
      if (data?.restructuringDetails && this.restructuringDetails?.form) {
        console.log('Populating restructuring details:', data.restructuringDetails);
        this.restructuringDetails.form.patchValue(data.restructuringDetails);
      }
      if (data?.revisedRepaymentSchedule && this.revisedSchedule?.form) {
        console.log('Populating revised repayment schedule:', data.revisedRepaymentSchedule);
        this.populateRevisedRepaymentSchedule(data.revisedRepaymentSchedule);
      }
      if (data?.correspondence && this.correspondence?.form) {
        console.log('Populating correspondence:', data.correspondence);
        this.populateCorrespondence(data.correspondence);
      }
    } catch (error) {
      console.error('Error populating form with draft data:', error);
    }

    this.cdr.detectChanges();
  }

  /**
   * Populate Basic Details section with FormArray handling
   */
  private populateBasicDetails(data: any): void {
    try {
      // Clear existing board members
      const boardMembersArray = this.borrowerDetails.form.get('boardMembers') as FormArray;
      boardMembersArray.clear();
      
      // Add board members from draft data
      if (data.boardMembers && data.boardMembers.length > 0) {
        data.boardMembers.forEach((member: any) => {
          const memberGroup = this.fb.group({
            name: [member.name || ''],
            designation: [member.designation || ''],
            contactDetails: [member.contactDetails || ''],
            address: [member.address || '']
          });
          boardMembersArray.push(memberGroup);
        });
      } else {
        // Add one empty row if no data
        this.borrowerDetails.addMember();
      }
      
      // Populate other basic details fields with proper field mapping
      const formData = {
        divisionName: data.divisionName || '',
        accountName: data.accountName || '',
        npaClassificationDate: data.npaDate || '', // Map npaDate to npaClassificationDate
        regionalOffice: data.regionalOffice || '',
        businessActivity: data.businessActivity || '',
        registeredAddress: data.registeredAddress || '',
        corporateOffice: data.corporateOffice || '',
        factoryAddress: data.factoryAddress || '',
        factoryRunningCondition: data.factoryRunningCondition || '',
        factoryNotRunningSince: data.factoryNotRunningSince || '',
        factoryLeasedOut: data.factoryLeasedOut || '',
        lesseeName: data.lesseeName || '',
        lesseeContactDetails: data.lesseeContactDetails || ''
      };
      
      // Patch all fields except boardMembers (which we handled separately)
      this.borrowerDetails.form.patchValue(formData);
      
    } catch (error) {
      console.error('Error populating basic details:', error);
    }
  }

  /**
   * Populate Facility Sanctioned section with FormArray handling
   */
  private populateFacilitySanctioned(data: any): void {
    try {
      // Draft data is already in API format, use it directly
      const facilitiesData = data.facilities || [];
      
      // Clear existing facilities
      const facilitiesArray = this.facilitySanctioned.form.get('facilities') as FormArray;
      facilitiesArray.clear();
      
      // Add facilities from draft data
      if (facilitiesData.length > 0) {
        facilitiesData.forEach((facility: any) => {
          const facilityGroup = this.fb.group({
            srNo: [facility.srNo || 1],
            nameOfFacility: [facility.nameOfFacility || ''],
            tenorOfFacility: [facility.tenorOfFacility || ''],
            amount: [facility.amount || null],
            dateOfSanction: [facility.dateOfSanction || ''],
            sanctionReferenceNo: [facility.sanctionReferenceNo || ''],
            documentationDate: [facility.documentationDate || ''],
            disbursedAmount: [facility.disbursedAmount || null],
            outstandingAmount: [facility.outstandingAmount || null],
            bankingArrangements: [facility.bankingArrangements || '']
          });
          facilitiesArray.push(facilityGroup);
        });
      } else {
        // Add one empty row if no data
        this.facilitySanctioned.addFacility();
      }
    } catch (error) {
      console.error('Error populating facility sanctioned:', error);
    }
  }

  /**
   * Populate Security Details section with FormArray handling
   */
  private populateSecurityDetails(data: any): void {
    try {
      // Draft data is already in API format, use it directly
      const securitiesData = data.securities || [];
      
      // Clear existing securities
      const securitiesArray = this.securityDetails.form.get('securities') as FormArray;
      securitiesArray.clear();
      
      // Add securities from draft data
      if (securitiesData.length > 0) {
        securitiesData.forEach((security: any) => {
          const securityGroup = this.fb.group({
            srNo: [security.srNo || 1],
            typeOfSecurity: [security.typeOfSecurity || ''],
            typeOfAsset: [security.typeOfAsset || ''],
            propertyDetails: [security.propertyDetails || ''],
            typeOfCharge: [security.typeOfCharge || ''],
            chargeDetails: [security.chargeDetails || ''],
            chargeCreationDate: [security.chargeCreationDate || ''],
            freeFromEncumbrances: [security.freeFromEncumbrances || '']
          });
          securitiesArray.push(securityGroup);
        });
      } else {
        // Add one empty row if no data
        this.securityDetails.addSecurity();
      }
      
      // Populate valuation and legal documents
      if (data.valuation) {
        this.securityDetails.form.get('valuation')?.patchValue(data.valuation);
      }
      if (data.legalDocuments) {
        this.securityDetails.form.get('legalDocuments')?.patchValue(data.legalDocuments);
      }
    } catch (error) {
      console.error('Error populating security details:', error);
    }
  }

  /**
   * Populate Release Details section with FormArray handling
   */
  private populateReleaseDetails(data: any): void {
    try {
      const releasesData = data.releases || [];
      
      // Clear existing releases
      const releasesArray = this.releaseDetails.form.get('releases') as FormArray;
      releasesArray.clear();
      
      // Add releases from draft data
      if (releasesData.length > 0) {
        releasesData.forEach((release: any) => {
          const releaseGroup = this.fb.group({
            srNo: [release.srNo || 1],
            dateOfRelease: [release.dateOfRelease || ''],
            againstReleaseLetter: [release.againstReleaseLetter || ''],
            amount: [release.amount || null]
          });
          releasesArray.push(releaseGroup);
        });
      } else {
        // Add one empty row if no data
        this.releaseDetails.addRelease();
      }
    } catch (error) {
      console.error('Error populating release details:', error);
    }
  }

  /**
   * Populate Repayment Schedule section with FormArray handling
   */
  private populateRepaymentSchedule(data: any): void {
    try {
      const schedulesData = data.schedules || [];
      
      // Clear existing schedules
      const schedulesArray = this.repaymentSchedule.form.get('schedules') as FormArray;
      schedulesArray.clear();
      
      // Add schedules from draft data
      if (schedulesData.length > 0) {
        schedulesData.forEach((schedule: any) => {
          const scheduleGroup = this.fb.group({
            srNo: [schedule.srNo || 1],
            installmentDate: [schedule.installmentDate || ''],
            installmentAmount: [schedule.installmentAmount || null],
            dateOfActualReceipt: [schedule.dateOfActualReceipt || '']
          });
          schedulesArray.push(scheduleGroup);
        });
      } else {
        // Add one empty row if no data
        this.repaymentSchedule.addSchedule();
      }
    } catch (error) {
      console.error('Error populating repayment schedule:', error);
    }
  }

  /**
   * Populate Revised Repayment Schedule section with FormArray handling
   */
  private populateRevisedRepaymentSchedule(data: any): void {
    try {
      const schedulesData = data.schedules || [];
      
      // Clear existing schedules
      const schedulesArray = this.revisedSchedule.form.get('schedules') as FormArray;
      schedulesArray.clear();
      
      // Add schedules from draft data
      if (schedulesData.length > 0) {
        schedulesData.forEach((schedule: any) => {
          const scheduleGroup = this.fb.group({
            srNo: [schedule.srNo || 1],
            installmentDate: [schedule.installmentDate || ''],
            installmentAmount: [schedule.installmentAmount || null],
            dateOfActualReceipt: [schedule.dateOfActualReceipt || '']
          });
          schedulesArray.push(scheduleGroup);
        });
      } else {
        // Add one empty row if no data
        this.revisedSchedule.addSchedule();
      }
    } catch (error) {
      console.error('Error populating revised repayment schedule:', error);
    }
  }

  /**
   * Populate Correspondence section with FormArray handling
   */
  private populateCorrespondence(data: any): void {
    try {
      const correspondencesData = data.correspondences || [];
      
      // Clear existing correspondences
      const correspondencesArray = this.correspondence.form.get('correspondences') as FormArray;
      correspondencesArray.clear();
      
      // Add correspondences from draft data
      if (correspondencesData.length > 0) {
        correspondencesData.forEach((correspondence: any) => {
          const correspondenceGroup = this.fb.group({
            srNo: [correspondence.srNo || 1],
            date: [correspondence.date || ''],
            particulars: [correspondence.particulars || ''],
            outcome: [correspondence.outcome || '']
          });
          correspondencesArray.push(correspondenceGroup);
        });
      } else {
        // Add one empty row if no data
        this.correspondence.addRow();
      }
    } catch (error) {
      console.error('Error populating correspondence:', error);
    }
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

    // Validate that at least basic details are filled
    if (!sections.basicDetails || Object.keys(sections.basicDetails).length === 0) {
      this.errorMessage.set('Please fill in at least the basic details before saving as draft.');
      return null;
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

  /**
   * Save form as draft
   */
  onSaveDraft(): void {
    this.errorMessage.set('');
    this.isSavingDraft.set(true);

    const formData = this.collectFormData();
    const draftTitle = `Draft - ${new Date().toLocaleString()}`;

    console.log('Save draft called. Current draftId:', this.draftId);
    console.log('Form data:', formData);

    // If formData is null, validation failed
    if (!formData) {
      this.isSavingDraft.set(false);
      return;
    }

    if (this.draftId) {
      // Update existing draft
      this.draftService.updateDraft(this.draftId, {
        draftTitle: draftTitle,
        draftData: formData
      }).subscribe({
        next: (response) => {
          this.isSavingDraft.set(false);
          alert('Draft updated successfully!');
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.isSavingDraft.set(false);
          let errorMsg = 'Failed to update draft. Please try again.';
          if (error.error?.message) {
            errorMsg = error.error.message;
          }
          this.errorMessage.set(errorMsg);
          this.cdr.detectChanges();
        }
      });
    } else {
      // Create new draft
      this.draftService.saveDraft({
        draftTitle: draftTitle,
        draftData: formData
      }).subscribe({
        next: (response) => {
          this.isSavingDraft.set(false);
          // Update the draftId with the newly created draft ID
          if (response.draftId) {
            this.draftId = response.draftId;
            console.log('Draft created with ID:', this.draftId);
          }
          alert('Draft saved successfully! You can continue editing this draft later.');
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.isSavingDraft.set(false);
          let errorMsg = 'Failed to save draft. Please try again.';
          if (error.error?.message) {
            errorMsg = error.error.message;
          }
          this.errorMessage.set(errorMsg);
          this.cdr.detectChanges();
        }
      });
    }
  }
}
