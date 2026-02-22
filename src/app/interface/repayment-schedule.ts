/**
 * Original Repayment Schedule Entity
 * Used for NPA form - Section 8
 */
export interface RepaymentSchedule {
  schedules: RepaymentItem[];
}

export interface RepaymentItem {
  srNo: number;
  installmentDate: string;
  installmentAmount: number | null;
  dateOfActualReceipt: string;
}

export function createEmptyRepaymentItem(srNo: number = 1): RepaymentItem {
  return {
    srNo,
    installmentDate: '',
    installmentAmount: null,
    dateOfActualReceipt: ''
  };
}
