import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

/**
 * Base interface for all NPA section services
 * Each section (BasicDetails, FacilitySanctioned, etc.) will implement this interface
 */
export interface INpaSectionService<T> {
  /**
   * Get the section name identifier
   */
  getSectionName(): string;

  /**
   * Transform form data to API payload format
   * @param formData The raw form data
   * @returns Transformed data ready for API
   */
  transformToPayload(formData: any): T;

  /**
   * Transform API response to form data format
   * @param apiData Data from API
   * @returns Data ready for form patching
   */
  transformFromApi(apiData: T): any;

  /**
   * Validate the section data
   * @param form The form group to validate
   * @returns true if valid, false otherwise
   */
  validate(form: FormGroup): boolean;

  /**
   * Get validation errors for the section
   * @param form The form group to check
   * @returns Object containing field errors
   */
  getValidationErrors(form: FormGroup): Record<string, string[]>;
}

/**
 * Interface for the complete NPA payload
 * This will grow as more sections are added
 */
export interface NpaPayload {
  basicDetails?: any;
  // Future sections will be added here:
  // facilitySanctioned?: FacilitySanctionedPayload;
  // securityDetails?: SecurityDetailsPayload;
  // guarantorDetails?: GuarantorDetailsPayload;
  // etc.
}

/**
 * Interface for NPA API response
 */
export interface NpaApiResponse {
  id: string;
  npaId?: string;
  message?: string;
  data?: any;
}
