/**
 * Centralized NPA Type Definitions
 * All NPA-related interfaces and types for type safety across the application
 */

import { BasicDetailsOfTheBorrower, BoardMember } from '../interface/basic-details-of-borrower';

// ============================================================================
// Facility Interfaces
// ============================================================================

export interface Facility {
  id: number;
  srNo: number;
  nameOfFacility: string;
  tenorOfFacility: string;
  amount: number;
  dateOfSanction: string;
  sanctionReferenceNo: string;
  documentationDate: string;
  disbursedAmount: number;
  outstandingAmount: number;
  bankingArrangements: string;
}

export interface FacilitySanctioned {
  id: number;
  facilities: Facility[];
}

// ============================================================================
// Security Details Interfaces
// ============================================================================

export interface SecurityDetail {
  id: number;
  srNo: number;
  typeOfSecurity: string;
  typeOfAsset: string;
  propertyDetails: string;
  typeOfCharge: string;
  chargeDetails: string;
  chargeCreationDate: string;
  freeFromEncumbrances: string;
}

export interface Valuation {
  id: number;
  nameOfValuer: string;
  dateOfReport: string;
  fmv: string;
  rv: string;
  dsv: string;
  guidelineGovtRate: string;
}

export interface LegalDocuments {
  id: number;
  loanAgreementDate: string;
  deedOfHypothecationDate: string;
  boardResolutionDate: string;
}

export interface SecurityDetails {
  id: number;
  securities: SecurityDetail[];
  valuation: Valuation;
  legalDocuments: LegalDocuments;
}

// ============================================================================
// Workflow & Task Interfaces
// ============================================================================

export interface Task {
  taskId: string | null;
  taskKey: string | null;
  taskName: string | null;
  assignee: string | null;
  candidateGroups: string[] | null;
  canCurrentUserAct: boolean;
  processInstanceId: string | null;
  npaId: number | null;
}

export interface CompletedTask {
  taskName: string;
  completedDate: string;
  completedBy: string;
  amount?: number;
  regionalOffice?: string;
  notes?: string;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  originalFileName: string;
}

// ============================================================================
// Complete NPA Response Interface
// ============================================================================

export interface NpaResponse {
  npaId: number;
  basicDetails?: BasicDetailsOfTheBorrower;
  facilitySanctioned?: FacilitySanctioned;
  securityDetails?: SecurityDetails;
  releaseDetails?: any;
  postDatedChequesDetails?: any;
  repaymentSchedule?: any;
  restructuringDetails?: any;
  revisedRepaymentSchedule?: any;
  correspondence?: any;
  username?: string;
  userType?: string;
  divisionName?: string;
  regionalOfficeName?: string;
  processInstanceId?: string;
  loanAmount?: number;
  divisionalMeetingAmount?: number;
  afterVetSaleNoticeAmount?: number;
}

// ============================================================================
// API Request/Response Types
// ============================================================================

export interface CreateNpaRequest {
  basicDetails: BasicDetailsOfTheBorrower;
  facilitySanctioned?: FacilitySanctioned;
  securityDetails?: SecurityDetails;
  releaseDetails?: any;
  postDatedChequesDetails?: any;
  repaymentSchedule?: any;
  restructuringDetails?: any;
  revisedRepaymentSchedule?: any;
  correspondence?: any;
}

export interface CreateNpaResponse {
  id: number;
  npaId: number;
  message: string;
}

export interface TaskCompletionRequest {
  taskId: string;
  payload: any;
  attachmentIds: string[];
  note: string;
}

export interface TaskCompletionResponse {
  success: boolean;
  message: string;
  taskId: string;
}

export interface RegionalOffice {
  id: string;
  name: string;
}

export interface FileUploadResponse {
  id: string;
  originalFileName: string;
  size: number;
  uploadDate: string;
}

// ============================================================================
// Utility Types
// ============================================================================

export type AccordionSection = 'basicDetails' | 'facilitySanctioned' | 'securityDetails';

export interface AccordionState {
  [key: string]: boolean;
}
