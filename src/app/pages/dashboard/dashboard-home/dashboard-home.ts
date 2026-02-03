import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-home',
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <div class="welcome-section">
        <h1>Welcome to the Dashboard</h1>
        <p>Select an option from the sidebar to get started.</p>
      </div>
      
      <div class="quick-stats" *ngIf="false"> <!-- Hidden for now -->
        <div class="stat-card">
          <h3>Total Users</h3>
          <p>{{ stats.totalUsers }}</p>
        </div>
        <div class="stat-card">
          <h3>Pending Requests</h3>
          <p>{{ stats.pendingRequests }}</p>
        </div>
        <div class="stat-card">
          <h3>Completed Tasks</h3>
          <p>{{ stats.completedTasks }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
      min-height: 100%;
    }
    
    .welcome-section {
      text-align: center;
      margin-bottom: 30px;
    }
    
    .welcome-section h1 {
      color: #333;
      font-size: 2rem;
      margin-bottom: 10px;
    }
    
    .welcome-section p {
      color: #666;
      font-size: 1.2rem;
    }
    
    .quick-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-top: 30px;
    }
    
    .stat-card {
      background: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      text-align: center;
    }
    
    .stat-card h3 {
      margin: 0 0 10px 0;
      color: #555;
    }
    
    .stat-card p {
      font-size: 1.5rem;
      font-weight: bold;
      color: #333;
      margin: 0;
    }
  `]
})
export class DashboardHome {
  stats = {
    totalUsers: 0,
    pendingRequests: 0,
    completedTasks: 0
  };
}