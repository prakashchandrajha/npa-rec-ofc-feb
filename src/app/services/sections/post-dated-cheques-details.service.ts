import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { INpaSectionService } from '../interfaces/section-service.interface';
import { PostDatedChequesDetails, createEmptyPostDatedChequesDetails } from '../../interface/post-dated-cheques-details';

/**
 * Payload interface for Post Dated Cheques Details section
 */
export interface PostDatedChequesDetailsPayload {
  pdcAvailable: string;
  numberOfPDCAvailable: string;
  pdcPresentedInBank: string;
  pdcNotPresentedReason: string;
  pdcDishonored: string;
  checkReturnMemoDate: string;
  legalNoticeIssued: string;
  legalNoticeDate: string;
  caseFiledUnder138: string;
  caseFilingDate: string;
  caseNumber: string;
  presentStatus: string;
  caseNotFiledReason: string;
}

/**
 * Service for handling Post Dated Cheques Details section
 * Implements INpaSectionService for consistent interface across all sections
 */
@Injectable({
  providedIn: 'root'
})
export class PostDatedChequesDetailsService implements INpaSectionService<PostDatedChequesDetailsPayload> {

  private readonly SECTION_NAME = 'postDatedChequesDetails';

  /**
   * Get the section name identifier
   */
  getSectionName(): string {
    return this.SECTION_NAME;
  }

  /**
   * Create empty post dated cheques details
   */
  createEmptyPostDatedChequesDetails(): PostDatedChequesDetails {
    return createEmptyPostDatedChequesDetails();
  }

  /**
   * Transform form data to API payload format
   */
  transformToPayload(formData: PostDatedChequesDetails): PostDatedChequesDetailsPayload {
    return {
      pdcAvailable: formData.pdcAvailable || '',
      numberOfPDCAvailable: formData.numberOfPDCAvailable || '',
      pdcPresentedInBank: formData.pdcPresentedInBank || '',
      pdcNotPresentedReason: formData.pdcNotPresentedReason || '',
      pdcDishonored: formData.pdcDishonored || '',
      checkReturnMemoDate: formData.checkReturnMemoDate || '',
      legalNoticeIssued: formData.legalNoticeIssued || '',
      legalNoticeDate: formData.legalNoticeDate || '',
      caseFiledUnder138: formData.caseFiledUnder138 || '',
      caseFilingDate: formData.caseFilingDate || '',
      caseNumber: formData.caseNumber || '',
      presentStatus: formData.presentStatus || '',
      caseNotFiledReason: formData.caseNotFiledReason || ''
    };
  }

  /**
   * Transform API response to form data format
   */
  transformFromApi(apiData: PostDatedChequesDetailsPayload): PostDatedChequesDetails {
    return {
      pdcAvailable: apiData.pdcAvailable || '',
      numberOfPDCAvailable: apiData.numberOfPDCAvailable || '',
      pdcPresentedInBank: apiData.pdcPresentedInBank || '',
      pdcNotPresentedReason: apiData.pdcNotPresentedReason || '',
      pdcDishonored: apiData.pdcDishonored || '',
      checkReturnMemoDate: apiData.checkReturnMemoDate || '',
      legalNoticeIssued: apiData.legalNoticeIssued || '',
      legalNoticeDate: apiData.legalNoticeDate || '',
      caseFiledUnder138: apiData.caseFiledUnder138 || '',
      caseFilingDate: apiData.caseFilingDate || '',
      caseNumber: apiData.caseNumber || '',
      presentStatus: apiData.presentStatus || '',
      caseNotFiledReason: apiData.caseNotFiledReason || ''
    };
  }

  /**
   * Validate the section data
   */
  validate(form: FormGroup): boolean {
    form.markAllAsTouched();
    return form.valid;
  }

  /**
   * Get validation errors for the section
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
   * Check if section has any data filled
   */
  hasData(form: FormGroup): boolean {
    const value = form.value;
    return !!(
      value.pdcAvailable ||
      value.numberOfPDCAvailable ||
      value.pdcPresentedInBank ||
      value.pdcDishonored ||
      value.legalNoticeIssued ||
      value.caseFiledUnder138
    );
  }
}
