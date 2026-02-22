import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BasicDetailsOfTheBorrower } from '../interface/basic-details-of-borrower';

export interface NpaCreateResponse {
  id: string;
  npaId?: string;
  message?: string;
}

export interface NpaDetailResponse {
  id: string;
  basicDetails: BasicDetailsOfTheBorrower;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NpaService {
  private apiUrl = 'http://localhost:8080/api/npa';

  constructor(private http: HttpClient) {}

  /**
   * Get authorization headers with Bearer token
   */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  /**
   * Create a new NPA record
   * @param basicDetails The basic details of the borrower
   * @returns Observable with the created NPA response
   */
  createNpa(basicDetails: BasicDetailsOfTheBorrower): Observable<NpaCreateResponse> {
    const payload = {
      basicDetails: {
        divisionName: basicDetails.divisionName,
        accountName: basicDetails.accountName,
        npaDate: basicDetails.npaClassificationDate,
        businessActivity: basicDetails.businessActivity,
        registeredAddress: basicDetails.registeredAddress,
        factoryRunningCondition: basicDetails.factoryRunningCondition,
        factoryLeasedOut: basicDetails.factoryLeasedOut,
        boardMembers: basicDetails.boardMembers || []
      }
    };

    return this.http.post<NpaCreateResponse>(this.apiUrl, payload, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Get all NPA records
   * @returns Observable with array of NPA records
   */
  getAllNpa(): Observable<NpaDetailResponse[]> {
    return this.http.get<NpaDetailResponse[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Get a single NPA record by ID
   * @param id The NPA ID
   * @returns Observable with NPA details
   */
  getNpaById(id: string): Observable<NpaDetailResponse> {
    return this.http.get<NpaDetailResponse>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Update an existing NPA record
   * @param id The NPA ID
   * @param basicDetails Updated basic details
   * @returns Observable with updated NPA response
   */
  updateNpa(id: string, basicDetails: Partial<BasicDetailsOfTheBorrower>): Observable<NpaDetailResponse> {
    return this.http.put<NpaDetailResponse>(`${this.apiUrl}/${id}`, basicDetails, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Delete an NPA record
   * @param id The NPA ID
   * @returns Observable void
   */
  deleteNpa(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
