import { Injectable } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { INpaSectionService } from '../interfaces/section-service.interface';
import { RepaymentSchedule, RepaymentItem, createEmptyRepaymentItem } from '../../interface/repayment-schedule';

export interface RepaymentSchedulePayload {
  schedules: RepaymentItemPayload[];
}

export interface RepaymentItemPayload {
  srNo: number;
  installmentDate: string;
  installmentAmount: number | null;
  dateOfActualReceipt: string;
}

/**
 * Service for handling Original Repayment Schedule section
 */
@Injectable({
  providedIn: 'root'
})
export class RepaymentScheduleService implements INpaSectionService<RepaymentSchedulePayload> {
  private readonly SECTION_NAME = 'repaymentSchedule';

  getSectionName(): string {
    return this.SECTION_NAME;
  }

  createEmptyItem(srNo: number): RepaymentItem {
    return createEmptyRepaymentItem(srNo);
  }

  transformToPayload(formData: RepaymentSchedule): RepaymentSchedulePayload {
    return {
      schedules: (formData.schedules || []).map((item, index) => ({
        srNo: index + 1,
        installmentDate: item.installmentDate || '',
        installmentAmount: item.installmentAmount || null,
        dateOfActualReceipt: item.dateOfActualReceipt || ''
      }))
    };
  }

  transformFromApi(apiData: RepaymentSchedulePayload): RepaymentSchedule {
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
