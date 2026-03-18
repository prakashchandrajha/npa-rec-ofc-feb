import { Component, OnInit, OnDestroy, ChangeDetectorRef, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { NpaApiService } from '../../services/npa-api.service';
import { Subscription, filter, finalize } from 'rxjs';
import {
  NpaResponse,
  Task,
  CompletedTask,
  RegionalOffice,
  Facility,
  SecurityDetail,
  AccordionState
} from '../../types/npa.types';
import { AccordionComponent } from '../../components/shared/accordion/accordion.component';

/**
 * NPA Detail Component - Refactored Version
 * Features:
 * - Modern Angular signals for state management
 * - Centralized API calls via NpaApiService
 * - Cleaner code organization
 * - Reusable accordion component
 */
@Component({
  selector: 'app-npa-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, AccordionComponent],
  templateUrl: './npa-detail.component.html',
  styleUrls: ['./npa-detail.component.css']
})
export class NpaDetailComponent implements OnInit, OnDestroy {
  // Signal-based state management
  readonly npaId = signal<string>('');
  readonly npaData = signal<NpaResponse | null>(null);
  readonly loading = signal<boolean>(true);
  readonly error = signal<string | null>(null);

  // Task state
  readonly currentTask = signal<Task | null>(null);
  readonly taskLoading = signal<boolean>(false);
  readonly taskError = signal<string | null>(null);

  // Modal state
  readonly showTaskModal = signal<boolean>(false);
  readonly submittingTask = signal<boolean>(false);
  taskNotes = '';
  selectedFiles: File[] = [];
  submitError: string | null = null;
  amount: number | null = null;

  // Regional Offices
  readonly regionalOffices = signal<RegionalOffice[]>([]);
  readonly loadingRegionalOffices = signal<boolean>(false);
  selectedRegionalOffice = '';

  // Completed tasks
  readonly completedTasks = signal<CompletedTask[]>([]);
  readonly loadingCompletedTasks = signal<boolean>(false);
  readonly completedTasksError = signal<string | null>(null);

  // Accordion state
  readonly accordionState: AccordionState = {
    basicDetails: true,
    facilitySanctioned: false,
    securityDetails: false
  };

  // Computed properties for cleaner templates
  readonly hasBoardMembers = computed(() => (this.npaData()?.basicDetails?.boardMembers?.length || 0) > 0);
  readonly hasFacilities = computed(() => (this.npaData()?.facilitySanctioned?.facilities?.length || 0) > 0);
  readonly hasSecurities = computed(() => (this.npaData()?.securityDetails?.securities?.length || 0) > 0);
  readonly hasValuation = computed(() => !!this.npaData()?.securityDetails?.valuation);
  readonly hasLegalDocuments = computed(() => !!this.npaData()?.securityDetails?.legalDocuments);
  readonly valuation = computed(() => this.npaData()?.securityDetails?.valuation || null);
  readonly legalDocuments = computed(() => this.npaData()?.securityDetails?.legalDocuments || null);
  readonly isRecoveryUser = computed(() => this.authService.getUserInfo()?.username === 'recovery');

  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private npaApiService: NpaApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.npaId.set(id);
      this.loadData();
      this.setupNavigationListener();
    } else {
      this.error.set('NPA ID not provided');
      this.loading.set(false);
    }
  }

  /**
   * Load all NPA data
   */
  private loadData(): void {
    const id = this.npaId();
    if (!id) return;

    this.loading.set(true);
    this.error.set(null);

    // Fetch NPA details, current task, and completed tasks in parallel
    Promise.all([
      this.fetchNpaDetails(),
      this.fetchCurrentTask(),
      this.fetchCompletedTasks()
    ]).finally(() => {
      this.loading.set(false);
      this.cdr.detectChanges();
    });
  }

  /**
   * Setup router navigation listener
   */
  private setupNavigationListener(): void {
    const navSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        if (event.urlAfterRedirects.includes('/dashboard/npa-detail/')) {
          const newNpaId = this.route.snapshot.paramMap.get('id');
          if (newNpaId && newNpaId !== this.npaId()) {
            this.npaId.set(newNpaId);
            this.loadData();
          }
        }
      });

    this.subscriptions.push(navSubscription);
  }

  /**
   * Fetch NPA details from API
   */
  private fetchNpaDetails(): Promise<void> {
    const token = this.authService.getToken();
    const id = this.npaId();

    if (!token) {
      this.error.set('Authentication token not found. Please login again.');
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      this.npaApiService.getNpaById(+id).subscribe({
        next: (data) => {
          this.npaData.set(data);
          resolve();
        },
        error: (error) => {
          console.error('Error fetching NPA details:', error);
          this.error.set('Failed to load NPA details. Please try again.');
          resolve();
        }
      });
    });
  }

  /**
   * Fetch current task from API
   */
  private fetchCurrentTask(): Promise<void> {
    const token = this.authService.getToken();
    const id = this.npaId();

    if (!token) {
      this.taskError.set('Authentication token not found.');
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      this.taskLoading.set(true);
      this.npaApiService.getCurrentTaskByNpaId(+id).subscribe({
        next: (task) => {
          this.currentTask.set(task);
          this.taskLoading.set(false);
          resolve();
        },
        error: (error) => {
          console.error('Error fetching current task:', error);
          this.taskError.set('Failed to load current task.');
          this.taskLoading.set(false);
          resolve();
        }
      });
    });
  }

  /**
   * Fetch completed tasks from API
   */
  private fetchCompletedTasks(): Promise<void> {
    const token = this.authService.getToken();
    const id = this.npaId();

    if (!token) {
      this.completedTasksError.set('Authentication token not found.');
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      this.loadingCompletedTasks.set(true);
      this.npaApiService.getCompletedTasks(+id).subscribe({
        next: (tasks) => {
          this.completedTasks.set(tasks);
          this.loadingCompletedTasks.set(false);
          resolve();
        },
        error: (error) => {
          console.error('Error fetching completed tasks:', error);
          this.completedTasksError.set('Failed to load completed tasks.');
          this.loadingCompletedTasks.set(false);
          resolve();
        }
      });
    });
  }

  /**
   * Toggle accordion section
   */
  toggleAccordion(section: string): void {
    this.accordionState[section] = !this.accordionState[section];
  }

  /**
   * Open task submission modal
   */
  openTaskModal(): void {
    const task = this.currentTask();
    if (!task?.canCurrentUserAct) return;

    this.showTaskModal.set(true);
    this.taskNotes = '';
    this.selectedFiles = [];
    this.submitError = null;
    this.selectedRegionalOffice = '';
    this.amount = null;

    // Fetch regional offices for specific task
    if (task.taskKey === 'after_vetting_13_2') {
      this.fetchRegionalOffices();
    }
  }

  /**
   * Close task submission modal
   */
  closeTaskModal(): void {
    this.showTaskModal.set(false);
    this.taskNotes = '';
    this.selectedFiles = [];
    this.submitError = null;
    this.selectedRegionalOffice = '';
    this.regionalOffices.set([]);
    this.amount = null;
  }

  /**
   * Fetch regional offices
   */
  private fetchRegionalOffices(): void {
    const token = this.authService.getToken();
    if (!token) return;

    this.loadingRegionalOffices.set(true);
    const subscription = this.npaApiService.getRegionalOffices().subscribe({
      next: (offices) => {
        this.regionalOffices.set(offices);
        this.loadingRegionalOffices.set(false);
      },
      error: (error) => {
        console.error('Error fetching regional offices:', error);
        this.loadingRegionalOffices.set(false);
      }
    });
    this.subscriptions.push(subscription);
  }

  /**
   * Handle file selection
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    Array.from(input.files).forEach(file => {
      // Validate file type
      if (file.type !== 'application/pdf') {
        this.submitError = `Only PDF files are allowed. ${file.name} is not a PDF.`;
        return;
      }

      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        this.submitError = `File ${file.name} is too large. Maximum size is 10MB.`;
        return;
      }

      this.selectedFiles.push(file);
    });

    this.cdr.detectChanges();
  }

  /**
   * Remove selected file
   */
  removeFile(index: number): void {
    if (index >= 0 && index < this.selectedFiles.length) {
      this.selectedFiles.splice(index, 1);
      this.cdr.detectChanges();
    }
  }

  /**
   * Complete current task
   */
  async completeTask(): Promise<void> {
    const task = this.currentTask();
    if (!task?.taskId) return;

    const token = this.authService.getToken();
    if (!token) {
      this.submitError = 'Authentication token not found.';
      return;
    }

    this.submittingTask.set(true);
    this.submitError = null;

    try {
      // Upload files first
      const attachmentIds = await this.uploadFiles(task.taskId);

      // Build payload
      const payload = this.buildTaskPayload(task);

      // Complete task
      const request = {
        taskId: task.taskId,
        payload,
        attachmentIds,
        note: this.taskNotes
      };

      this.npaApiService.completeTask(request).subscribe({
        next: () => {
          this.submittingTask.set(false);
          this.showTaskModal.set(false);
          this.fetchCurrentTask();
          this.fetchCompletedTasks();
        },
        error: (error) => {
          console.error('Error completing task:', error);
          this.submitError = 'Failed to complete task. Please try again.';
          this.submittingTask.set(false);
        }
      });
    } catch (error) {
      console.error('Error in task completion:', error);
      this.submitError = 'Failed to complete task.';
      this.submittingTask.set(false);
    }
  }

  /**
   * Upload selected files
   */
  private async uploadFiles(taskId: string): Promise<string[]> {
    const attachmentIds: string[] = [];

    for (const file of this.selectedFiles) {
      try {
        const response = await this.npaApiService.uploadFile(file, taskId).toPromise();
        if (response?.id) {
          attachmentIds.push(response.id.toString());
        }
      } catch (error) {
        console.error('Failed to upload file:', file.name, error);
        throw error;
      }
    }

    return attachmentIds;
  }

  /**
   * Build task payload based on task key
   */
  private buildTaskPayload(task: Task): any {
    const payload: any = { field1: 'value1' };

    if (this.taskNotes) {
      payload.notes = this.taskNotes;
    }

    if (task.taskKey === 'after_vetting_13_2' && this.selectedRegionalOffice) {
      payload.regionalOffice = this.selectedRegionalOffice;
    }

    const tasksWithAmount = ['loan_amount', 'Loan_loan_amount', 'after_vet_sale_notice', 'divisional_meeting'];
    if (task.taskKey && tasksWithAmount.includes(task.taskKey) && this.amount !== null) {
      payload.amount = this.amount;
    }

    return payload;
  }

  /**
   * Download attachment
   */
  downloadAttachment(attachmentId: string, fileName: string, isHistory: boolean = false): void {
    const token = this.authService.getToken();
    if (!token) return;

    this.npaApiService.downloadAttachment(attachmentId, isHistory).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error downloading attachment:', error);
      }
    });
  }

  /**
   * Navigate back to NPA list
   */
  goBack(): void {
    this.router.navigate(['/dashboard/all-npa']);
  }

  /**
   * Navigate to edit NPA page
   */
  editNpa(): void {
    this.router.navigate([`/edit-npa/${this.npaId()}`]);
  }

  /**
   * Refresh NPA data
   */
  refreshNpaDetails(): void {
    this.loadData();
  }

  // ============================================================================
  // Computed Helper Methods for Template
  // ============================================================================

  get facilities(): Facility[] {
    return this.npaData()?.facilitySanctioned?.facilities || [];
  }

  get boardMembers() {
    return this.npaData()?.basicDetails?.boardMembers || [];
  }

  get securities(): SecurityDetail[] {
    return this.npaData()?.securityDetails?.securities || [];
  }

  getTotalSanctionedAmount(): number {
    return this.facilities.reduce((total, facility) => total + (facility.amount || 0), 0);
  }

  getTotalOutstandingAmount(): number {
    return this.facilities.reduce((total, facility) => total + (facility.outstandingAmount || 0), 0);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
