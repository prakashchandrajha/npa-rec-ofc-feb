/**
 * Security Details Entity
 * Used for NPA form - Section 3: Details of Security
 */
export interface SecurityDetails {
  securities: SecurityItem[];
}

/**
 * Individual Security Item
 */
export interface SecurityItem {
  srNo: number;
  typeOfSecurity: string; // Land/Stock/etc.
  typeOfAsset: string; // Movable/Immovable
  propertyDetails: string; // Complete Address including admeasuring
  typeOfCharge: string; // First/Second/Pari-passu
  chargeDetails: string; // Details with date of NOC if paripassu or other than first exclusive charge
  chargeCreationDate: string;
  freeFromEncumbrances: string; // Yes/No
}

/**
 * Default security types for dropdown
 */
export const SECURITY_TYPES = [
  'Land',
  'Stock',
  'Building',
  'Machinery',
  'Fixed Deposit',
  'Gold/Ornaments',
  'Other'
];

/**
 * Asset types
 */
export const ASSET_TYPES = [
  'Movable',
  'Immovable'
];

/**
 * Charge types
 */
export const CHARGE_TYPES = [
  'First',
  'Second',
  'Pari-passu',
  'Exclusive'
];

/**
 * Create a new empty security item
 */
export function createEmptySecurityItem(srNo: number = 1): SecurityItem {
  return {
    srNo,
    typeOfSecurity: '',
    typeOfAsset: '',
    propertyDetails: '',
    typeOfCharge: '',
    chargeDetails: '',
    chargeCreationDate: '',
    freeFromEncumbrances: ''
  };
}
