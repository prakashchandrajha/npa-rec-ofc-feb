import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NpaPayload, NpaApiResponse } from './interfaces/section-service.interface';
import { BasicDetailsService } from './sections/basic-details.service';
import { FacilitySanctionedService } from './sections/facility-sanctioned.service';

/**
 * Facade service for NPA operations
 * Orchestrates all section services and handles API communication
 * 
 * Usage:
 * - Each section has its own service (BasicDetailsService, FacilitySanctionedService, etc.)
 * - This facade collects data from all sections and sends to API
 * - Clean separation of concerns - each section handles its own data transformation
 */
@Injectable({
  providedIn: 'root'
})
export class NpaService {
  private apiUrl = 'http://localhost:8080/api/npa';

  constructor(
    private http: HttpClient,
    private basicDetailsService: BasicDetailsService,
    private facilitySanctionedService: FacilitySanctionedService
  ) {}

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
   * @param payload Complete NPA payload from all sections
   * @returns Observable with the created NPA response
   */
  createNpa(payload: NpaPayload): Observable<NpaApiResponse> {
    return this.http.post<NpaApiResponse>(this.apiUrl, payload, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Get all NPA records
   * @returns Observable with array of NPA records
   */
  getAllNpa(): Observable<NpaApiResponse[]> {
    return this.http.get<NpaApiResponse[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Get a single NPA record by ID
   * @param id The NPA ID
   * @returns Observable with NPA details
   */
  getNpaById(id: string): Observable<NpaApiResponse> {
    return this.http.get<NpaApiResponse>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Update an existing NPA record
   * @param id The NPA ID
   * @param payload Updated payload (can be partial)
   * @returns Observable with updated NPA response
   */
  updateNpa(id: string, payload: Partial<NpaPayload>): Observable<NpaApiResponse> {
    return this.http.put<NpaApiResponse>(`${this.apiUrl}/${id}`, payload, {
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

  // ============================================
  // Section Service Accessors
  // ============================================
  // These methods provide access to individual section services
  // Each section service handles its own data transformation
  // ============================================

  /**
   * Get the Basic Details section service
   * Use this to transform basic details data before sending to API
   */
  get basicDetails(): BasicDetailsService {
    return this.basicDetailsService;
  }

  /**
   * Get the Facility Sanctioned section service
   * Use this to transform facility sanctioned data before sending to API
   */
  get facilitySanctioned(): FacilitySanctionedService {
    return this.facilitySanctionedService;
  }

  // Future section service accessors will be added here:
  // get securityDetails(): SecurityDetailsService { ... }
  // get guarantorDetails(): GuarantorDetailsService { ... }
  // etc.

  /**
   * Build complete NPA payload from all section form data
   * @param sections Object containing form data from each section
   * @returns Complete NpaPayload ready for API
   * 
   * Example usage:
   * const payload = this.npaService.buildPayload({
   *   basicDetails: this.basicDetailsComponent.form.value,
   *   facilitySanctioned: this.facilitySanctionedComponent.form.value
   * });
   */
  buildPayload(sections: { 
    basicDetails?: any;
    facilitySanctioned?: any;
    // Add more sections as they are implemented:
    // securityDetails?: any;
    // guarantorDetails?: any;
  }): NpaPayload {
    const payload: NpaPayload = {};

    if (sections.basicDetails) {
      payload.basicDetails = this.basicDetailsService.transformToPayload(sections.basicDetails);
    }

    if (sections.facilitySanctioned) {
      payload.facilitySanctioned = this.facilitySanctionedService.transformToPayload(sections.facilitySanctioned);
    }

    // Add more sections as they are implemented:
    // if (sections.securityDetails) {
    //   payload.securityDetails = this.securityDetailsService.transformToPayload(sections.securityDetails);
    // }

    return payload;
  }
}
