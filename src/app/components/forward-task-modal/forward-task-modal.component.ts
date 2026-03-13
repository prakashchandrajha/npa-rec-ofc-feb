import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowService, RecoveryUser, ForwardTaskRequest } from '../../services/workflow.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forward-task-modal',
  imports: [CommonModule,FormsModule],
  templateUrl: './forward-task-modal.component.html',
  styleUrl: './forward-task-modal.component.css'
})
export class ForwardTaskModalComponent {
  @Input() taskId: string = '';
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() forwardSuccess = new EventEmitter<void>();

  recoveryUsers: RecoveryUser[] = [];
  selectedUserId: number | null = null;
  forwardNote: string = '';
  loading: boolean = false;
  error: string = '';

  constructor(private workflowService: WorkflowService) {}

  ngOnChanges(): void {
    if (this.isVisible && this.taskId) {
      this.loadRecoveryUsers();
    }
  }

  loadRecoveryUsers(): void {
    this.loading = true;
    this.error = '';
    
    this.workflowService.getRecoveryUsers().subscribe({
      next: (users) => {
        this.recoveryUsers = users;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading recovery users:', err);
        this.error = 'Failed to load recovery users';
        this.loading = false;
      }
    });
  }

  onForward(): void {
    if (!this.selectedUserId) {
      this.error = 'Please select a user to forward to';
      return;
    }

    this.loading = true;
    this.error = '';

    const request: ForwardTaskRequest = {
      taskId: this.taskId,
      forwardToUserId: this.selectedUserId,
      note: this.forwardNote,
      payload: {}
    };

    this.workflowService.forwardTask(request).subscribe({
      next: () => {
        this.loading = false;
        this.forwardSuccess.emit();
        this.closeModal();
      },
      error: (err) => {
        console.error('Error forwarding task:', err);
        this.error = 'Failed to forward task. Please try again.';
        this.loading = false;
      }
    });
  }

  closeModal(): void {
    this.close.emit();
    this.resetForm();
  }

  resetForm(): void {
    this.selectedUserId = null;
    this.forwardNote = '';
    this.error = '';
    this.recoveryUsers = [];
  }
}
