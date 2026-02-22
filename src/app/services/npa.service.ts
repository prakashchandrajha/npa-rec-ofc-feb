import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NpaPayload, NpaApiResponse } from './interfaces/section-service.interface';
import { BasicDetailsService } from './sections/basic-details.service';
import { FacilitySanctionedService } from './sections/facility-sanctioned.service';
import { SecurityDetailsService } from './sections/security-details.service';
import { ReleaseDetailsService } from './sections/release-details.service';
import { PostDatedChequesDetailsService } from './sections/post-dated-cheques-details.service';

/**
 * Facade service for NPA operations
 * Orchestrates all section services and handles API communication
 */
@Injectable({
  providedIn: 'root'
})
export class NpaService {
  private apiUrl = 'http://localhost:8080/api/npa';

  constructor(
    private http: HttpClient,
    private basicDetailsService: BasicDetailsService,
    private facilitySanctionedService: FacilitySanctionedService,
    private securityDetailsService: SecurityDetailsService,
    private releaseDetailsService: ReleaseDetailsService,
    private postDatedChequesDetailsService: PostDatedChequesDetailsService
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  createNpa(payload: NpaPayload): Observable<NpaApiResponse> {
    return this.http.post<NpaApiResponse>(this.apiUrl, payload, {
      headers: this.getAuthHeaders()
    });
  }

  getAllNpa(): Observable<NpaApiResponse[]> {
    return this.http.get<NpaApiResponse[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  getNpaById(id: string): Observable<NpaApiResponse> {
    return this.http.get<NpaApiResponse>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  updateNpa(id: string, payload: Partial<NpaPayload>): Observable<NpaApiResponse> {
    return this.http.put<NpaApiResponse>(`${this.apiUrl}/${id}`, payload, {
      headers: this.getAuthHeaders()
    });
  }

  deleteNpa(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Section Service Accessors
  get basicDetails(): BasicDetailsService {
    return this.basicDetailsService;
  }

  get facilitySanctioned(): FacilitySanctionedService {
    return this.facilitySanctionedService;
  }

  get securityDetails(): SecurityDetailsService {
    return this.securityDetailsService;
  }

  get releaseDetails(): ReleaseDetailsService {
    return this.releaseDetailsService;
  }

  get postDatedChequesDetails(): PostDatedChequesDetailsService {
    return this.postDatedChequesDetailsService;
  }

  buildPayload(sections: { 
    basicDetails?: any;
    facilitySanctioned?: any;
    securityDetails?: any;
    releaseDetails?: any;
    postDatedChequesDetails?: any;
  }): NpaPayload {
    const payload: NpaPayload = {};

    if (sections.basicDetails) {
      payload.basicDetails = this.basicDetailsService.transformToPayload(sections.basicDetails);
    }
    if (sections.facilitySanctioned) {
      payload.facilitySanctioned = this.facilitySanctionedService.transformToPayload(sections.facilitySanctioned);
    }
    if (sections.securityDetails) {
      payload.securityDetails = this.securityDetailsService.transformToPayload(sections.securityDetails);
    }
    if (sections.releaseDetails) {
      payload.releaseDetails = this.releaseDetailsService.transformToPayload(sections.releaseDetails);
    }
    if (sections.postDatedChequesDetails) {
      payload.postDatedChequesDetails = this.postDatedChequesDetailsService.transformToPayload(sections.postDatedChequesDetails);
    }

    return payload;
  }
}
