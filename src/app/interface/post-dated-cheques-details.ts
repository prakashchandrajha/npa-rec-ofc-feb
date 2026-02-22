/**
 * Post Dated Cheques Details Entity
 * Used for NPA form - Section 7: Post Dated Cheques Details
 */
export interface PostDatedChequesDetails {
  // a. Whether PDC available
  pdcAvailable: string; // Yes/No
  
  // b. Number of PDC Available
  numberOfPDCAvailable: string;
  
  // c. Whether PDC presented in Bank
  pdcPresentedInBank: string; // Yes/No
  pdcNotPresentedReason: string; // If No, Reason for same
  
  // d. Whether PDC dishonored
  pdcDishonored: string; // Yes/No
  checkReturnMemoDate: string; // If yes, date of check return memo
  
  // e. Whether Legal Notice issued under NI Act
  legalNoticeIssued: string; // Yes/No
  legalNoticeDate: string; // If yes, date of sending notice
  
  // f. Whether case filed under Sec 138 of NI Act
  caseFiledUnder138: string; // Yes/No
  caseFilingDate: string; // Date of filing of case/application
  caseNumber: string; // Case No.
  presentStatus: string; // Present Status
  
  // g. If No, reason for same
  caseNotFiledReason: string;
}

/**
 * Create empty Post Dated Cheques details
 */
export function createEmptyPostDatedChequesDetails(): PostDatedChequesDetails {
  return {
    pdcAvailable: '',
    numberOfPDCAvailable: '',
    pdcPresentedInBank: '',
    pdcNotPresentedReason: '',
    pdcDishonored: '',
    checkReturnMemoDate: '',
    legalNoticeIssued: '',
    legalNoticeDate: '',
    caseFiledUnder138: '',
    caseFilingDate: '',
    caseNumber: '',
    presentStatus: '',
    caseNotFiledReason: ''
  };
}
