import { Injectable } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { INpaSectionService } from '../interfaces/section-service.interface';
import { Correspondence, CorrespondenceSection } from '../../interface/correspondence';

export interface CorrespondencePayload {
  correspondences: CorrespondencePayloadItem[];
}

export interface CorrespondencePayloadItem {
  srNo: number;
  particulars: string;
  date: string;
  outcome: string;
}

@Injectable({
  providedIn: 'root'
})
export class CorrespondenceService implements INpaSectionService<CorrespondencePayload> {
  private readonly SECTION_NAME = 'correspondence';

  getSectionName(): string {
    return this.SECTION_NAME;
  }

  transformToPayload(formData: CorrespondenceSection): CorrespondencePayload {
    return {
      correspondences: (formData.correspondences || []).map((item, index) => ({
        srNo: index + 1,
        particulars: item.particulars || '',
        date: item.date || '',
        outcome: item.outcome || ''
      }))
    };
  }

  transformFromApi(apiData: CorrespondencePayload): CorrespondenceSection {
    return {
      correspondences: (apiData.correspondences || []).map(item => ({
        srNo: item.srNo,
        particulars: item.particulars || '',
        date: item.date || '',
        outcome: item.outcome || ''
      }))
    };
  }

  validate(form: FormGroup): boolean {
    form.markAllAsTouched();
    return form.valid;
  }

  getValidationErrors(form: FormGroup): Record<string, string[]> {
    const errors: Record<string, string[]> = {};
    if (!form.valid) {
      const arr = form.get('correspondences') as FormArray;
      if (arr) {
        arr.controls.forEach((control, index) => {
          if (control instanceof FormGroup && !control.valid) {
            Object.keys(control.controls).forEach(key => {
              const field = control.get(key);
              if (field && field.errors) {
                errors[`correspondences.${index}.${key}`] = Object.keys(field.errors).map(errorType => {
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

  hasData(form: FormGroup): boolean {
    const arr = form.get('correspondences') as FormArray;
    if (!arr) return false;
    return arr.controls.some(control => {
      const v = control.value;
      return v && (v.particulars || v.date || v.outcome);
    });
  }
}
