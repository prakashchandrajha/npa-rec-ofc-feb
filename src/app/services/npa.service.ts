import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NpaPayload, NpaApiResponse } from './interfaces/section-service.interface';
import { BasicDetailsService } from './sections/basic-details.service';
import { FacilitySanctionedService } from './sections/facility-sanctioned.service';
import { SecurityDetailsService } from './sections/security-details.service';
import { ReleaseDetailsService } from './sections/release-details.service';
import { PostDatedChequesDetailsService } from './sections/post-dated-cheques-details.service';
import { RepaymentScheduleService } from './sections/repayment-schedule.service';
import { RestructuringDetailsService } from './sections/restructuring-details.service';
import { CorrespondenceService } from './sections/correspondence.service';
import { RevisedRepaymentScheduleService } from './sections/revised-repayment-schedule.service';
import { environment } from '../../environments/environment';

/**
 * Facade service for NPA operations
 * Orchestrates all section services and handles API communication
 */
@Injectable({
  providedIn: 'root'
})
export class NpaService {
  private apiUrl = `${environment.apiUrl}/npa`;

  constructor(
    private http: HttpClient,
    private basicDetailsService: BasicDetailsService,
    private facilitySanctionedService: FacilitySanctionedService,
    private securityDetailsService: SecurityDetailsService,
    private releaseDetailsService: ReleaseDetailsService,
    private postDatedChequesDetailsService: PostDatedChequesDetailsService
    ,
    private repaymentScheduleService: RepaymentScheduleService
    ,
    private restructuringDetailsService: RestructuringDetailsService
    ,
    private correspondenceService: CorrespondenceService
    ,
    private revisedRepaymentScheduleService: RevisedRepaymentScheduleService
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

  get repaymentSchedule(): RepaymentScheduleService {
    return this.repaymentScheduleService;
  }

  get restructuringDetails(): RestructuringDetailsService {
    return this.restructuringDetailsService;
  }

  get correspondence(): CorrespondenceService {
    return this.correspondenceService;
  }

  get revisedRepaymentSchedule(): RevisedRepaymentScheduleService {
    return this.revisedRepaymentScheduleService;
  }

  buildPayload(sections: { 
    basicDetails?: any;
    facilitySanctioned?: any;
    securityDetails?: any;
    releaseDetails?: any;
    postDatedChequesDetails?: any;
    repaymentSchedule?: any;
    restructuringDetails?: any;
    correspondence?: any;
    revisedRepaymentSchedule?: any;
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
    if (sections.repaymentSchedule) {
      payload.repaymentSchedule = this.repaymentScheduleService.transformToPayload(sections.repaymentSchedule);
    }
    if (sections.restructuringDetails) {
      payload.restructuringDetails = this.restructuringDetailsService.transformToPayload(sections.restructuringDetails);
    }
    if (sections.revisedRepaymentSchedule) {
      payload.revisedRepaymentSchedule = this.revisedRepaymentScheduleService.transformToPayload(sections.revisedRepaymentSchedule);
    }
    if (sections.correspondence) {
      payload.correspondence = this.correspondenceService.transformToPayload(sections.correspondence);
    }

    return payload;
  }
}
