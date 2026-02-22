import { RepaymentItem } from './repayment-schedule';

/**
 * Restructuring details including revised repayment schedule
 */
export interface RestructuringDetails {
  restructured: string; // 'yes' or 'no'
  restructuringDate: string;
  referenceNo: string;
  restructuringTerm: string;
  nonRepaymentNonCompliance: string;
}

export function createEmptyRestructuringDetails(): RestructuringDetails {
  return {
    restructured: '',
    restructuringDate: '',
    referenceNo: '',
    restructuringTerm: '',
    nonRepaymentNonCompliance: '',
    // revisedSchedules removed, handled separately
  };
}
