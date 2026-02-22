import { Injectable } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { INpaSectionService } from '../interfaces/section-service.interface';
import { RepaymentSchedule, RepaymentItem } from '../../interface/repayment-schedule';

export interface RevisedRepaymentSchedulePayload {
  schedules: RevisedItemPayload[];
}

export interface RevisedItemPayload {
  srNo: number;
  installmentDate: string;
  installmentAmount: number | null;
  dateOfActualReceipt: string;
}

/**
 * Service for handling Revised Repayment Schedule (Section 10)
 */
@Injectable({
  providedIn: 'root'
})
export class RevisedRepaymentScheduleService implements INpaSectionService<RevisedRepaymentSchedulePayload> {
  private readonly SECTION_NAME = 'revisedRepaymentSchedule';

  getSectionName(): string {
    return this.SECTION_NAME;
  }

  transformToPayload(formData: RepaymentSchedule): RevisedRepaymentSchedulePayload {
    return {
      schedules: (formData.schedules || []).map((item, index) => ({
        srNo: index + 1,
        installmentDate: item.installmentDate || '',
        installmentAmount: item.installmentAmount || null,
        dateOfActualReceipt: item.dateOfActualReceipt || ''
      }))
    };
  }

  transformFromApi(apiData: RevisedRepaymentSchedulePayload): RepaymentSchedule {
    return {
      schedules: (apiData.schedules || []).map(item => ({
        srNo: item.srNo,
        installmentDate: item.installmentDate || '',
        installmentAmount: item.installmentAmount || null,
        dateOfActualReceipt: item.dateOfActualReceipt || ''
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
      const schedules = form.get('schedules') as FormArray;
      if (schedules) {
        schedules.controls.forEach((control, index) => {
          if (control instanceof FormGroup && !control.valid) {
            Object.keys(control.controls).forEach(key => {
              const fieldControl = control.get(key);
              if (fieldControl && fieldControl.errors) {
                errors[`schedules.${index}.${key}`] = Object.keys(fieldControl.errors).map(errorType => {
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
    const schedules = form.get('schedules') as FormArray;
    if (!schedules) return false;
    return schedules.controls.some(control => {
      const value = control.value;
      return value && (
        value.installmentDate ||
        value.installmentAmount ||
        value.dateOfActualReceipt
      );
    });
  }
}
