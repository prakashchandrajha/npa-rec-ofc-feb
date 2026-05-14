import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NpaDraftService, NpaDraft } from '../../services/npa-draft.service';
import { signal } from '@angular/core';

@Component({
  selector: 'app-drafts-npa',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './drafts-npa.html',
  styleUrl: './drafts-npa.css'
})
export class DraftsNpa implements OnInit {
  drafts = signal<NpaDraft[]>([]);
  loading = signal<boolean>(true);
  errorMessage = signal<string>('');
  selectedDraftId: number | null = null;

  constructor(
    private draftService: NpaDraftService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDrafts();
  }

  loadDrafts(): void {
    this.loading.set(true);
    this.draftService.getUserDrafts().subscribe({
      next: (drafts) => {
        this.drafts.set(drafts || []);
        this.loading.set(false);
      },
      error: (error) => {
        this.errorMessage.set('Failed to load drafts');
        this.loading.set(false);
      }
    });
  }

  editDraft(draft: NpaDraft): void {
    if (draft.draftId) {
      // Navigate to create-npa with draft ID to edit it
      this.router.navigate(['/dashboard/create-npa'], { 
        queryParams: { draftId: draft.draftId } 
      });
    }
  }

  deleteDraft(draftId: number | undefined): void {
    if (!draftId) return;

    if (!confirm('Are you sure you want to delete this draft?')) {
      return;
    }

    this.draftService.deleteDraft(draftId).subscribe({
      next: () => {
        this.drafts.set(this.drafts().filter(d => d.draftId !== draftId));
        alert('Draft deleted successfully');
      },
      error: (error) => {
        this.errorMessage.set('Failed to delete draft');
      }
    });
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  }

  goBack(): void {
    this.router.navigate(['/dashboard/dashboard-content']);
  }
}
