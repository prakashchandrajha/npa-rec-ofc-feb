import { Injectable } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { INpaSectionService } from '../interfaces/section-service.interface';
import { ReleaseDetails, ReleaseItem, createEmptyReleaseItem } from '../../interface/release-details';

/**
 * Payload interface for Release Details section
 */
export interface ReleaseDetailsPayload {
  releases: ReleaseItemPayload[];
}

export interface ReleaseItemPayload {
  srNo: number;
  dateOfRelease: string;
  againstReleaseLetter: string;
  amount: number | null;
}

/**
 * Service for handling Release Details section
 * Implements INpaSectionService for consistent interface across all sections
 */
@Injectable({
  providedIn: 'root'
})
export class ReleaseDetailsService implements INpaSectionService<ReleaseDetailsPayload> {

  private readonly SECTION_NAME = 'releaseDetails';

  /**
   * Get the section name identifier
   */
  getSectionName(): string {
    return this.SECTION_NAME;
  }

  /**
   * Create empty release item
   */
  createEmptyReleaseItem(srNo: number): ReleaseItem {
    return createEmptyReleaseItem(srNo);
  }

  /**
   * Transform form data to API payload format
   */
  transformToPayload(formData: ReleaseDetails): ReleaseDetailsPayload {
    return {
      releases: (formData.releases || []).map((release, index) => ({
        srNo: index + 1,
        dateOfRelease: release.dateOfRelease || '',
        againstReleaseLetter: release.againstReleaseLetter || '',
        amount: release.amount || null
      }))
    };
  }

  /**
   * Transform API response to form data format
   */
  transformFromApi(apiData: ReleaseDetailsPayload): ReleaseDetails {
    return {
      releases: (apiData.releases || []).map(release => ({
        srNo: release.srNo,
        dateOfRelease: release.dateOfRelease || '',
        againstReleaseLetter: release.againstReleaseLetter || '',
        amount: release.amount || null
      }))
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
      const releases = form.get('releases') as FormArray;
      if (releases) {
        releases.controls.forEach((control, index) => {
          if (control instanceof FormGroup && !control.valid) {
            Object.keys(control.controls).forEach(key => {
              const fieldControl = control.get(key);
              if (fieldControl && fieldControl.errors) {
                errors[`releases.${index}.${key}`] = Object.keys(fieldControl.errors).map(errorType => {
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
    const releases = form.get('releases') as FormArray;
    if (!releases) return false;

    return releases.controls.some(control => {
      const value = control.value;
      return value && (
        value.dateOfRelease ||
        value.againstReleaseLetter ||
        value.amount
      );
    });
  }
}
