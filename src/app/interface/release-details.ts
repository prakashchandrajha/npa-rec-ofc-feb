/**
 * Release Details Entity
 * Used for NPA form - Section 6: Release Details
 */
export interface ReleaseDetails {
  releases: ReleaseItem[];
}

/**
 * Individual Release Item
 */
export interface ReleaseItem {
  srNo: number;
  dateOfRelease: string;
  againstReleaseLetter: string;
  amount: number | null;
}

/**
 * Create empty release item
 */
export function createEmptyReleaseItem(srNo: number = 1): ReleaseItem {
  return {
    srNo,
    dateOfRelease: '',
    againstReleaseLetter: '',
    amount: null
  };
}
