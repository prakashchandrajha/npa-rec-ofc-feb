/**
 * Facility Sanctioned Entity
 * Used for NPA form - Section 2: Facility Sanctioned
 */
export interface FacilitySanctioned {
  facilities: FacilityItem[];
}

/**
 * Individual Facility Item
 */
export interface FacilityItem {
  srNo: number;
  nameOfFacility: string;
  tenorOfFacility: string;
  amount: number | null;
  dateOfSanction: string; // Date with Sanction Reference no.
  sanctionReferenceNo: string;
  documentationDate: string;
  disbursedAmount: number | null;
  outstandingAmount: number | null;
  bankingArrangements: string; // Consortium/ Multiple/ Group Lending/ Details of other lenders
}

/**
 * Default facility types for initial rows
 */
export const DEFAULT_FACILITY_TYPES = [

  '' // Empty row for additional facility
];

/**
 * Create a new empty facility item
 */
export function createEmptyFacilityItem(srNo: number = 1, nameOfFacility: string = ''): FacilityItem {
  return {
    srNo,
    nameOfFacility,
    tenorOfFacility: '',
    amount: null,
    dateOfSanction: '',
    sanctionReferenceNo: '',
    documentationDate: '',
    disbursedAmount: null,
    outstandingAmount: null,
    bankingArrangements: ''
  };
}
