import { Injectable } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { INpaSectionService } from '../interfaces/section-service.interface';
import { FacilitySanctioned, FacilityItem, createEmptyFacilityItem, DEFAULT_FACILITY_TYPES } from '../../interface/facility-sanctioned';

/**
 * Payload interface for Facility Sanctioned section
 */
export interface FacilitySanctionedPayload {
  facilities: FacilityItemPayload[];
}

export interface FacilityItemPayload {
  srNo: number;
  nameOfFacility: string;
  tenorOfFacility: string;
  amount: number | null;
  dateOfSanction: string;
  sanctionReferenceNo: string;
  documentationDate: string;
  disbursedAmount: number | null;
  outstandingAmount: number | null;
  bankingArrangements: string;
}

/**
 * Service for handling Facility Sanctioned section
 * Implements INpaSectionService for consistent interface across all sections
 */
@Injectable({
  providedIn: 'root'
})
export class FacilitySanctionedService implements INpaSectionService<FacilitySanctionedPayload> {

  private readonly SECTION_NAME = 'facilitySanctioned';

  /**
   * Get the section name identifier
   */
  getSectionName(): string {
    return this.SECTION_NAME;
  }

  /**
   * Get default facility types
   */
  getDefaultFacilityTypes(): string[] {
    return [...DEFAULT_FACILITY_TYPES];
  }

  /**
   * Create empty facility item
   */
  createEmptyFacilityItem(srNo: number, nameOfFacility: string = ''): FacilityItem {
    return createEmptyFacilityItem(srNo, nameOfFacility);
  }

  /**
   * Transform form data to API payload format
   * @param formData The raw form data from FacilitySanctionedComponent
   * @returns Transformed data ready for API
   */
  transformToPayload(formData: FacilitySanctioned): FacilitySanctionedPayload {
    return {
      facilities: (formData.facilities || []).map((facility, index) => ({
        srNo: index + 1,
        nameOfFacility: facility.nameOfFacility || '',
        tenorOfFacility: facility.tenorOfFacility || '',
        amount: facility.amount || null,
        dateOfSanction: facility.dateOfSanction || '',
        sanctionReferenceNo: facility.sanctionReferenceNo || '',
        documentationDate: facility.documentationDate || '',
        disbursedAmount: facility.disbursedAmount || null,
        outstandingAmount: facility.outstandingAmount || null,
        bankingArrangements: facility.bankingArrangements || ''
      }))
    };
  }

  /**
   * Transform API response to form data format
   * @param apiData Data from API
   * @returns Data ready for form patching
   */
  transformFromApi(apiData: FacilitySanctionedPayload): FacilitySanctioned {
    return {
      facilities: (apiData.facilities || []).map(facility => ({
        srNo: facility.srNo,
        nameOfFacility: facility.nameOfFacility || '',
        tenorOfFacility: facility.tenorOfFacility || '',
        amount: facility.amount || null,
        dateOfSanction: facility.dateOfSanction || '',
        sanctionReferenceNo: facility.sanctionReferenceNo || '',
        documentationDate: facility.documentationDate || '',
        disbursedAmount: facility.disbursedAmount || null,
        outstandingAmount: facility.outstandingAmount || null,
        bankingArrangements: facility.bankingArrangements || ''
      }))
    };
  }

  /**
   * Validate the section data
   * @param form The form group to validate
   * @returns true if valid, false otherwise
   */
  validate(form: FormGroup): boolean {
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
      // Check facilities array
      const facilities = form.get('facilities') as FormArray;
      if (facilities) {
        facilities.controls.forEach((control, index) => {
          if (control instanceof FormGroup && !control.valid) {
            Object.keys(control.controls).forEach(key => {
              const fieldControl = control.get(key);
              if (fieldControl && fieldControl.errors) {
                errors[`facilities.${index}.${key}`] = Object.keys(fieldControl.errors).map(errorType => {
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
   * @param form The form group to check
   * @returns true if any field has data
   */
  hasData(form: FormGroup): boolean {
    const facilities = form.get('facilities') as FormArray;
    if (!facilities) return false;

    return facilities.controls.some(control => {
      const value = control.value;
      return value && (
        value.nameOfFacility ||
        value.tenorOfFacility ||
        value.amount ||
        value.dateOfSanction ||
        value.sanctionReferenceNo ||
        value.documentationDate ||
        value.disbursedAmount ||
        value.outstandingAmount ||
        value.bankingArrangements
      );
    });
  }
}