import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { INpaSectionService } from '../interfaces/section-service.interface';
import { BasicDetailsOfTheBorrower, BoardMember } from '../../interface/basic-details-of-borrower';

/**
 * Payload interface for Basic Details section
 */
export interface BasicDetailsPayload {
  divisionName: string;
  accountName: string;
  npaDate: string;
  regionalOffice?: string;
  businessActivity?: string;
  registeredAddress?: string;
  corporateOffice?: string;
  factoryAddress?: string;
  factoryRunningCondition?: string;
  factoryNotRunningSince?: string;
  factoryLeasedOut?: string;
  lesseeName?: string;
  lesseeContactDetails?: string;
  boardMembers?: BoardMember[];
}

/**
 * Service for handling Basic Details of Borrower section
 * Implements INpaSectionService for consistent interface across all sections
 */
@Injectable({
  providedIn: 'root'
})
export class BasicDetailsService implements INpaSectionService<BasicDetailsPayload> {

  private readonly SECTION_NAME = 'basicDetails';

  /**
   * Get the section name identifier
   */
  getSectionName(): string {
    return this.SECTION_NAME;
  }

  /**
   * Transform form data to API payload format
   * @param formData The raw form data from BasicDetailsOfTheBorrower01Component
   * @returns Transformed data ready for API
   */
  transformToPayload(formData: BasicDetailsOfTheBorrower): BasicDetailsPayload {
    return {
      divisionName: formData.divisionName || '',
      accountName: formData.accountName || '',
      npaDate: formData.npaClassificationDate || '',
      regionalOffice: formData.regionalOffice || '',
      businessActivity: formData.businessActivity || '',
      registeredAddress: formData.registeredAddress || '',
      corporateOffice: formData.corporateOffice || '',
      factoryAddress: formData.factoryAddress || '',
      factoryRunningCondition: formData.factoryRunningCondition || '',
      factoryNotRunningSince: formData.factoryNotRunningSince || '',
      factoryLeasedOut: formData.factoryLeasedOut || '',
      lesseeName: formData.lesseeName || '',
      lesseeContactDetails: formData.lesseeContactDetails || '',
      boardMembers: formData.boardMembers || []
    };
  }

  /**
   * Transform API response to form data format
   * @param apiData Data from API
   * @returns Data ready for form patching
   */
  transformFromApi(apiData: BasicDetailsPayload): Partial<BasicDetailsOfTheBorrower> {
    return {
      divisionName: apiData.divisionName || '',
      accountName: apiData.accountName || '',
      npaClassificationDate: apiData.npaDate || '',
      regionalOffice: apiData.regionalOffice || '',
      businessActivity: apiData.businessActivity || '',
      registeredAddress: apiData.registeredAddress || '',
      corporateOffice: apiData.corporateOffice || '',
      factoryAddress: apiData.factoryAddress || '',
      factoryRunningCondition: (apiData.factoryRunningCondition as 'yes' | 'no') || '',
      factoryNotRunningSince: apiData.factoryNotRunningSince || '',
      factoryLeasedOut: (apiData.factoryLeasedOut as 'yes' | 'no') || '',
      lesseeName: apiData.lesseeName || '',
      lesseeContactDetails: apiData.lesseeContactDetails || '',
      boardMembers: apiData.boardMembers || []
    };
  }

  /**
   * Validate the section data
   * @param form The form group to validate
   * @returns true if valid, false otherwise
   */
  validate(form: FormGroup): boolean {
    // Mark all fields as touched to show validation errors
    form.markAllAsTouched();
    return form.valid;
  }

  /**
   * Get validation errors for the section
   * @param form The form group to check
   * @returns Object containing field errors
   */
  getValidationErrors(form: FormGroup): Record<string, string[]> {
    const errors: Record<string, string[]> = {};

    if (!form.valid) {
      Object.keys(form.controls).forEach(key => {
        const control = form.get(key);
        if (control && control.errors) {
          errors[key] = Object.keys(control.errors).map(errorType => {
            switch (errorType) {
              case 'required':
                return 'This field is required';
              default:
                return `Validation error: ${errorType}`;
            }
          });
        }
      });
    }

    return errors;
  }

  /**
   * Check if the section has required fields filled
   * @param form The form group to check
   * @returns true if required fields are filled
   */
  hasRequiredFields(form: FormGroup): boolean {
    const divisionName = form.get('divisionName')?.value;
    const npaClassificationDate = form.get('npaClassificationDate')?.value;
    return !!(divisionName && npaClassificationDate);
  }
}
