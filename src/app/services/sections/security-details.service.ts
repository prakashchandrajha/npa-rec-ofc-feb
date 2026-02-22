import { Injectable } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { INpaSectionService } from '../interfaces/section-service.interface';
import { SecurityDetails, SecurityItem, ValuationDetails, LegalDocuments, createEmptySecurityItem, createEmptyValuationDetails, createEmptyLegalDocuments, SECURITY_TYPES, ASSET_TYPES, CHARGE_TYPES } from '../../interface/security-details';

/**
 * Payload interface for Security Details section
 */
export interface SecurityDetailsPayload {
  securities: SecurityItemPayload[];
  valuation: ValuationPayload;
  legalDocuments: LegalDocumentsPayload;
}

export interface SecurityItemPayload {
  srNo: number;
  typeOfSecurity: string;
  typeOfAsset: string;
  propertyDetails: string;
  typeOfCharge: string;
  chargeDetails: string;
  chargeCreationDate: string;
  freeFromEncumbrances: string;
}

export interface ValuationPayload {
  nameOfValuer: string;
  dateOfReport: string;
  fmv: string;
  rv: string;
  dsv: string;
  guidelineGovtRate: string;
}

export interface LegalDocumentsPayload {
  loanAgreementDate: string;
  deedOfHypothecationDate: string;
  boardResolutionDate: string;
}

/**
 * Service for handling Security Details section
 * Implements INpaSectionService for consistent interface across all sections
 */
@Injectable({
  providedIn: 'root'
})
export class SecurityDetailsService implements INpaSectionService<SecurityDetailsPayload> {

  private readonly SECTION_NAME = 'securityDetails';

  /**
   * Get the section name identifier
   */
  getSectionName(): string {
    return this.SECTION_NAME;
  }

  /**
   * Get security types for dropdown
   */
  getSecurityTypes(): string[] {
    return [...SECURITY_TYPES];
  }

  /**
   * Get asset types for dropdown
   */
  getAssetTypes(): string[] {
    return [...ASSET_TYPES];
  }

  /**
   * Get charge types for dropdown
   */
  getChargeTypes(): string[] {
    return [...CHARGE_TYPES];
  }

  /**
   * Create empty security item
   */
  createEmptySecurityItem(srNo: number): SecurityItem {
    return createEmptySecurityItem(srNo);
  }

  /**
   * Create empty valuation details
   */
  createEmptyValuationDetails(): ValuationDetails {
    return createEmptyValuationDetails();
  }

  /**
   * Create empty legal documents
   */
  createEmptyLegalDocuments(): LegalDocuments {
    return createEmptyLegalDocuments();
  }

  /**
   * Transform form data to API payload format
   */
  transformToPayload(formData: SecurityDetails): SecurityDetailsPayload {
    return {
      securities: (formData.securities || []).map((security, index) => ({
        srNo: index + 1,
        typeOfSecurity: security.typeOfSecurity || '',
        typeOfAsset: security.typeOfAsset || '',
        propertyDetails: security.propertyDetails || '',
        typeOfCharge: security.typeOfCharge || '',
        chargeDetails: security.chargeDetails || '',
        chargeCreationDate: security.chargeCreationDate || '',
        freeFromEncumbrances: security.freeFromEncumbrances || ''
      })),
      valuation: {
        nameOfValuer: formData.valuation?.nameOfValuer || '',
        dateOfReport: formData.valuation?.dateOfReport || '',
        fmv: formData.valuation?.fmv || '',
        rv: formData.valuation?.rv || '',
        dsv: formData.valuation?.dsv || '',
        guidelineGovtRate: formData.valuation?.guidelineGovtRate || ''
      },
      legalDocuments: {
        loanAgreementDate: formData.legalDocuments?.loanAgreementDate || '',
        deedOfHypothecationDate: formData.legalDocuments?.deedOfHypothecationDate || '',
        boardResolutionDate: formData.legalDocuments?.boardResolutionDate || ''
      }
    };
  }

  /**
   * Transform API response to form data format
   */
  transformFromApi(apiData: SecurityDetailsPayload): SecurityDetails {
    return {
      securities: (apiData.securities || []).map(security => ({
        srNo: security.srNo,
        typeOfSecurity: security.typeOfSecurity || '',
        typeOfAsset: security.typeOfAsset || '',
        propertyDetails: security.propertyDetails || '',
        typeOfCharge: security.typeOfCharge || '',
        chargeDetails: security.chargeDetails || '',
        chargeCreationDate: security.chargeCreationDate || '',
        freeFromEncumbrances: security.freeFromEncumbrances || ''
      })),
      valuation: {
        nameOfValuer: apiData.valuation?.nameOfValuer || '',
        dateOfReport: apiData.valuation?.dateOfReport || '',
        fmv: apiData.valuation?.fmv || '',
        rv: apiData.valuation?.rv || '',
        dsv: apiData.valuation?.dsv || '',
        guidelineGovtRate: apiData.valuation?.guidelineGovtRate || ''
      },
      legalDocuments: {
        loanAgreementDate: apiData.legalDocuments?.loanAgreementDate || '',
        deedOfHypothecationDate: apiData.legalDocuments?.deedOfHypothecationDate || '',
        boardResolutionDate: apiData.legalDocuments?.boardResolutionDate || ''
      }
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
      const securities = form.get('securities') as FormArray;
      if (securities) {
        securities.controls.forEach((control, index) => {
          if (control instanceof FormGroup && !control.valid) {
            Object.keys(control.controls).forEach(key => {
              const fieldControl = control.get(key);
              if (fieldControl && fieldControl.errors) {
                errors[`securities.${index}.${key}`] = Object.keys(fieldControl.errors).map(errorType => {
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
        });
      }
    }

    return errors;
  }

  /**
   * Check if section has any data filled
   */
  hasData(form: FormGroup): boolean {
    const securities = form.get('securities') as FormArray;
    if (!securities) return false;

    return securities.controls.some(control => {
      const value = control.value;
      return value && (
        value.typeOfSecurity ||
        value.typeOfAsset ||
        value.propertyDetails ||
        value.typeOfCharge ||
        value.chargeDetails ||
        value.chargeCreationDate ||
        value.freeFromEncumbrances
      );
    });
  }
}
