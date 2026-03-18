import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-home',
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <!-- Welcome section -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p class="text-gray-600 mt-2">Key metrics and insights</p>
      </div>

      <!-- Stat Cards -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <!-- Total NPAs -->
        <div class="bg-white rounded-lg shadow-md p-6 flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">Total NPAs</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totalNPAs }}</p>
          </div>
          <div class="text-indigo-500">
            <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 12c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c2.21 0 4 1.79 4 4h2c0-3.31-2.69-6-6-6-3.31 0-6 2.69-6 6h2c0-2.21 1.79-4 4-4z"></path>
            </svg>
          </div>
        </div>

        <!-- Pending Actions -->
        <div class="bg-white rounded-lg shadow-md p-6 flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">Pending Actions</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.pendingActions }}</p>
          </div>
          <div class="text-orange-500">
            <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m0-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>

        <!-- Completed Tasks -->
        <div class="bg-white rounded-lg shadow-md p-6 flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">Completed Tasks</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.completedTasks }}</p>
          </div>
          <div class="text-green-500">
            <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>

        <!-- Under Review -->
        <div class="bg-white rounded-lg shadow-md p-6 flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">Under Review</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.underReview }}</p>
          </div>
          <div class="text-yellow-500">
            <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Graphs -->
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <!-- Bar Chart -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Monthly NPA Trends</h2>
          <div class="h-48">
            <!-- Placeholder for bar chart -->
            <div class="relative h-full w-full bg-gray-200 rounded">
              <div class="absolute bottom-0 left-0 h-20 w-1/4 bg-indigo-500"></div>
              <div class="absolute bottom-0 left-1/3 h-36 w-1/4 bg-indigo-400"></div>
              <div class="absolute bottom-0 left-1/2 h-28 w-1/4 bg-indigo-300"></div>
              <div class="absolute bottom-0 right-0 h-24 w-1/4 bg-indigo-200"></div>
            </div>
          </div>
          <p class="text-sm text-gray-500 mt-2">Last 6 months</p>
        </div>

        <!-- Line Chart -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Action Items Status</h2>
          <div class="h-48">
            <!-- Placeholder for line chart -->
            <svg class="h-full w-full" viewBox="0 0 100 50" preserveAspectRatio="none">
              <polyline points="0,40 20,30 40,20 60,30 80,10 100,40" fill="none" stroke="blue-500" stroke-width="2"/>
            </svg>
          </div>
          <p class="text-sm text-gray-500 mt-2">Overview</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
      min-height: 100%;
    }
  `]
})
export class DashboardHome {
  stats = {
    totalNPAs: 1234,
    pendingActions: 45,
    completedTasks: 980,
    underReview: 23
  };
}