import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface NpaDraft {
  draftId?: number;
  draftTitle: string;
  draftData: any;
  createdAt?: string;
  lastUpdatedAt?: string;
  isSubmitted?: boolean;
  submittedNpaId?: number;
  username?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NpaDraftService {
  private apiUrl = `${environment.apiUrl}/npa-draft`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  saveDraft(draft: NpaDraft): Observable<NpaDraft> {
    return this.http.post<NpaDraft>(this.apiUrl, draft, {
      headers: this.getAuthHeaders()
    });
  }

  updateDraft(draftId: number, draft: NpaDraft): Observable<NpaDraft> {
    return this.http.put<NpaDraft>(`${this.apiUrl}/${draftId}`, draft, {
      headers: this.getAuthHeaders()
    });
  }

  getDraftById(draftId: number): Observable<NpaDraft> {
    return this.http.get<NpaDraft>(`${this.apiUrl}/${draftId}`, {
      headers: this.getAuthHeaders()
    });
  }

  getUserDrafts(): Observable<NpaDraft[]> {
    return this.http.get<NpaDraft[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  deleteDraft(draftId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${draftId}`, {
      headers: this.getAuthHeaders()
    });
  }

  submitDraft(draftId: number): Observable<NpaDraft> {
    return this.http.post<NpaDraft>(`${this.apiUrl}/${draftId}/submit`, {}, {
      headers: this.getAuthHeaders()
    });
  }
}
