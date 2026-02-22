/**
 * Correspondence with defaulter society
 * Section 13
 */
export interface Correspondence {
  srNo: number;
  particulars: string;
  date: string;
  outcome: string;
}

export interface CorrespondenceSection {
  correspondences: Correspondence[];
}

export function createEmptyCorrespondence(srNo: number = 1): Correspondence {
  return {
    srNo,
    particulars: '',
    date: '',
    outcome: ''
  };
}
