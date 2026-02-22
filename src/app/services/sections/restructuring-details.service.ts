import { Injectable } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { INpaSectionService } from '../interfaces/section-service.interface';
import { RestructuringDetails } from '../../interface/restructuring-details';

export interface RestructuringDetailsPayload {
  restructured: string;
  restructuringDate: string;
  referenceNo: string;
  restructuringTerm: string;
  nonRepaymentNonCompliance: string;
}

export interface RestructuringSchedulePayload {
  srNo: number;
  installmentDate: string;
  installmentAmount: number | null;
  dateOfActualReceipt: string;
}

@Injectable({
  providedIn: 'root'
})
export class RestructuringDetailsService implements INpaSectionService<RestructuringDetailsPayload> {
  private readonly SECTION_NAME = 'restructuringDetails';

  getSectionName(): string {
    return this.SECTION_NAME;
  }

  transformToPayload(formData: RestructuringDetails): RestructuringDetailsPayload {
    return {
      restructured: formData.restructured || '',
      restructuringDate: formData.restructuringDate || '',
      referenceNo: formData.referenceNo || '',
      restructuringTerm: formData.restructuringTerm || '',
      nonRepaymentNonCompliance: formData.nonRepaymentNonCompliance || '',
    };
  }

  transformFromApi(apiData: RestructuringDetailsPayload): RestructuringDetails {
    return {
      restructured: apiData.restructured || '',
      restructuringDate: apiData.restructuringDate || '',
      referenceNo: apiData.referenceNo || '',
      restructuringTerm: apiData.restructuringTerm || '',
      nonRepaymentNonCompliance: apiData.nonRepaymentNonCompliance || '',
      // revisedSchedules removed
    };
  }

  validate(form: FormGroup): boolean {
    form.markAllAsTouched();
    return form.valid;
  }

  getValidationErrors(form: FormGroup): Record<string, string[]> {
    const errors: Record<string, string[]> = {};
    if (!form.valid) {
      const schedules = form.get('revisedSchedules') as FormArray;
      if (schedules) {
        schedules.controls.forEach((control, index) => {
          if (control instanceof FormGroup && !control.valid) {
            Object.keys(control.controls).forEach(key => {
              const fieldControl = control.get(key);
              if (fieldControl && fieldControl.errors) {
                errors[`revisedSchedules.${index}.${key}`] = Object.keys(fieldControl.errors).map(errorType => {
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
    const baseFields = [
      form.get('restructured')?.value,
      form.get('restructuringDate')?.value,
      form.get('referenceNo')?.value,
      form.get('restructuringTerm')?.value,
      form.get('nonRepaymentNonCompliance')?.value
    ];
    if (baseFields.some(v => v)) {
      return true;
    }
    return false;
  }
}
