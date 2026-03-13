import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  NpaResponse,
  Task,
  CompletedTask,
  RegionalOffice,
  FileUploadResponse,
  TaskCompletionRequest,
  TaskCompletionResponse
} from '../types/npa.types';

/**
 * NPA API Service
 * Centralized service for all NPA-related API calls
 */
@Injectable({
  providedIn: 'root'
})
export class NpaApiService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  /**
   * Get NPA details by ID
   */
  getNpaById(npaId: number): Observable<NpaResponse> {
    return this.http.get<NpaResponse>(`${this.baseUrl}/npa/${npaId}`, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Get current task for an NPA
   */
  getCurrentTaskByNpaId(npaId: number): Observable<Task> {
    return this.http.get<Task>(`${this.baseUrl}/workflow/task/by-npa/${npaId}`, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Get completed tasks history for an NPA
   */
  getCompletedTasks(npaId: number): Observable<CompletedTask[]> {
    return this.http.get<CompletedTask[]>(`${this.baseUrl}/npa/${npaId}/history`, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Get list of regional offices
   */
  getRegionalOffices(): Observable<RegionalOffice[]> {
    return this.http.get<RegionalOffice[]>(`${this.baseUrl}/users/regional-offices`, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Complete a task
   */
  completeTask(request: TaskCompletionRequest): Observable<TaskCompletionResponse> {
    return this.http.post<TaskCompletionResponse>(
      `${this.baseUrl}/workflow/task/complete`,
      request,
      { headers: this.getAuthHeaders() }
    );
  }

  /**
   * Upload a file
   */
  uploadFile(file: File, taskId: string): Observable<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('taskId', taskId);
    return this.http.post<FileUploadResponse>(`${this.baseUrl}/files/upload`, formData, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Download an attachment
   */
  downloadAttachment(attachmentId: string, isHistory: boolean = false): Observable<Blob> {
    const endpoint = isHistory ? 'history' : '';
    return this.http.get(`${this.baseUrl}/files/${endpoint}/download/${attachmentId}`, {
      headers: this.getAuthHeaders(),
      responseType: 'blob'
    });
  }
}
