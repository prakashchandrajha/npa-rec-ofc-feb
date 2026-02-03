/**
 * Basic Details of the Borrower Entity
 * Used for NPA form data structure
 */
export interface BasicDetailsOfTheBorrower {
  divisionName: string;
  regionalOffice: string;
  accountName: string;
  npaClassificationDate: string; // Format: YYYY-MM-DD
  businessActivity: string;
  registeredAddress: string;
  corporateOffice: string;
  factoryAddress: string;
  factoryRunningCondition: 'yes' | 'no';
  factoryNotRunningSince?: string;
  factoryLeasedOut: 'yes' | 'no';
  lesseeName?: string;
  lesseeContactDetails?: string;
  boardMembers: BoardMember[];
}

/**
 * Board Member entity for board members array
 */
export interface BoardMember {
  name: string;
  designation: string;
  contactDetails: string;
  address: string;
}
