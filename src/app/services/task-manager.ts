export interface TaskWithStatus {
  taskName: string;
  npaDate: string;
  allowedDays: number;
  daysPassed: number;
  overdueDays: number;
  status: string;
}

export class TaskManager {
  private tasksData: TaskWithStatus[] = [
    {
      taskName: "DRAFT 13(2)",
      npaDate: "2026-03-06",
      allowedDays: 27,
      daysPassed: 0,
      overdueDays: 0,
      status: "Not Due"
    },
    {
      taskName: "LOAN AMOUNT",
      npaDate: "2026-03-10",
      allowedDays: 30,
      daysPassed: 0,
      overdueDays: 0,
      status: "Not Due"
    },
    {
      taskName: "VETTING 13(2)",
      npaDate: "2026-03-12",
      allowedDays: 35,
      daysPassed: 0,
      overdueDays: 0,
      status: "Not Due"
    },{
      taskName: "AFTER VETTING 13(2)",
      npaDate: "2026-03-12",
      allowedDays: 38,
      daysPassed: 0,
      overdueDays: 0,
      status: "Not Due"
    },{
      taskName: "SEND NOTICE TO BORROWER",
      npaDate: "2026-03-12",
      allowedDays: 40,
      daysPassed: 0,
      overdueDays: 0,
      status: "Not Due"
    },{
      taskName: "DRAFT 13(4)",
      npaDate: "2026-03-12",
      allowedDays: 45,
      daysPassed: 0,
      overdueDays: 0,
      status: "Not Due"
    },{
      taskName: "VETTING 13(4)",
      npaDate: "2026-03-12",
      allowedDays: 50,
      daysPassed: 0,
      overdueDays: 0,
      status: "Not Due"
    },{
      taskName: "AFTER VETTING 13(4)",
      npaDate: "2026-03-12",
      allowedDays: 55,
      daysPassed: 0,
      overdueDays: 0,
      status: "Not Due"
    },{
      taskName: "File From Recovery after vet 13(4)",
      npaDate: "2026-03-12",
      allowedDays: 60,
      daysPassed: 0,
      overdueDays: 0,
      status: "Not Due"
    },{
      taskName: "Draft Sale Notice",
      npaDate: "2026-03-12",
      allowedDays: 65,
      daysPassed: 0,
      overdueDays: 0,
      status: "Not Due"
    },{
      taskName: "VETTING SALE NOTICE",
      npaDate: "2026-03-12",
      allowedDays: 70,
      daysPassed: 0,
      overdueDays: 0,
      status: "Not Due"
    },{
      taskName: "After Vet Sale notice",
      npaDate: "2026-03-12",
      allowedDays: 75,
      daysPassed: 0,
      overdueDays: 0,
      status: "Not Due"
    },
    {
      taskName: "DIVISIONAL MEETING",
      npaDate: "2026-03-12",
      allowedDays: 80,
      daysPassed: 0,
      overdueDays: 0,
      status: "Not Due"
    },
    {
      taskName: "File After Divisional Meeting",
      npaDate: "2026-03-12",
      allowedDays: 85,
      daysPassed: 0,
      overdueDays: 0,
      status: "Not Due"
    },
    {
      taskName: "File From Recovery After Vet Sale Notice",
      npaDate: "2026-03-12",
      allowedDays: 90,
      daysPassed: 0,
      overdueDays: 0,
      status: "Not Due"
    }
  ];

  private workingHoursPerDay = 8;

  getTasks(): TaskWithStatus[] {
    return this.tasksData;
  }

  updateTaskStatuses(): TaskWithStatus[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    this.tasksData = this.tasksData.map(task => {
      const npaDate = new Date(task.npaDate);
      npaDate.setHours(0, 0, 0, 0);

      const diffTime = today.getTime() - npaDate.getTime();
      const daysPassed = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      let overdueDays = 0;
      let status = "Not Due";

      if (daysPassed > task.allowedDays) {
        overdueDays = daysPassed - task.allowedDays;

        // ✅ Your requirement: "1 day due", "2 days due"
        status = overdueDays === 1
          ? "1 day due"
          : `${overdueDays} days due`;
      }

      return {
        ...task,
        daysPassed,
        overdueDays,
        status
      };
    });

    return this.tasksData;
  }

  calculateWorkingTime(days: number): number {
    return days * this.workingHoursPerDay;
  }

  getWorkingTimeForTask(task: TaskWithStatus): number {
    return this.calculateWorkingTime(task.daysPassed);
  }

  getWorkingTimeForOverdue(task: TaskWithStatus): number {
    return task.overdueDays > 0
      ? this.calculateWorkingTime(task.overdueDays)
      : 0;
  }

  addTask(task: TaskWithStatus): void {
    this.tasksData.push(task);
  }

  removeTask(taskName: string): void {
    this.tasksData = this.tasksData.filter(task => task.taskName !== taskName);
  }

  getTaskByName(taskName: string): TaskWithStatus | undefined {
    return this.tasksData.find(task => task.taskName === taskName);
  }

  getTotalWorkingTime(): number {
    return this.tasksData.reduce((total, task) => {
      return total + this.calculateWorkingTime(task.daysPassed);
    }, 0);
  }

  getTotalOverdueWorkingTime(): number {
    return this.tasksData.reduce((total, task) => {
      return total + this.calculateWorkingTime(task.overdueDays);
    }, 0);
  }

  getOverdueTasks(): TaskWithStatus[] {
    return this.tasksData.filter(task => task.overdueDays > 0);
  }

  getOnTimeTasks(): TaskWithStatus[] {
    return this.tasksData.filter(task => task.overdueDays === 0);
  }

  getTaskStatistics() {
    return {
      totalTasks: this.tasksData.length,
      overdueTasks: this.getOverdueTasks().length,
      onTimeTasks: this.getOnTimeTasks().length,
      totalWorkingHours: this.getTotalWorkingTime(),
      totalOverdueHours: this.getTotalOverdueWorkingTime()
    };
  }

  exportToCSV(): string {
    const updatedTasks = this.updateTaskStatuses();

    let csv =
      "Task Name,NPA Date,Allowed Days,Days Passed,Overdue Days,Status,Working Hours,Overdue Hours\n";

    updatedTasks.forEach(task => {
      const workingHours = this.calculateWorkingTime(task.daysPassed);
      const overdueHours = this.calculateWorkingTime(task.overdueDays);

      csv += `${task.taskName},${task.npaDate},${task.allowedDays},${task.daysPassed},${task.overdueDays},${task.status},${workingHours},${overdueHours}\n`;
    });

    return csv;
  }

  exportToJSON(): string {
    return JSON.stringify(this.updateTaskStatuses(), null, 2);
  }

  printReport(): void {
    const stats = this.getTaskStatistics();
    const updatedTasks = this.updateTaskStatuses();

    console.log("📊 TASK MANAGEMENT REPORT");
    console.log("=".repeat(30));

    console.log(`Total Tasks: ${stats.totalTasks}`);
    console.log(`On Time Tasks: ${stats.onTimeTasks}`);
    console.log(`Overdue Tasks: ${stats.overdueTasks}`);

    console.log("-".repeat(30));
    console.log("🔥 OVERDUE TASKS:");

    const overdueTasks = this.getOverdueTasks();

    if (overdueTasks.length === 0) {
      console.log("  None");
    } else {
      overdueTasks.forEach(task => {
        console.log(
          `  ${task.taskName}: ${task.status} (${task.overdueDays} days, ${this.calculateWorkingTime(task.overdueDays)} hours)`
        );
      });
    }

    console.log("-".repeat(30));
    console.log("⏰ WORKING TIME SUMMARY:");
    console.log(`  Total Working Hours: ${stats.totalWorkingHours}`);
    console.log(`  Total Overdue Hours: ${stats.totalOverdueHours}`);

    console.log("-".repeat(30));
    console.log("📋 TASK DETAILS:");

    updatedTasks.forEach(task => {
      console.log(`  ${task.taskName}: ${task.status}`);
      console.log(`    NPA Date: ${task.npaDate}`);
      console.log(`    Allowed: ${task.allowedDays} days`);
      console.log(`    Passed: ${task.daysPassed} days`);
      console.log(`    Working Hours: ${this.calculateWorkingTime(task.daysPassed)}`);

      if (task.overdueDays > 0) {
        console.log(
          `    Overdue: ${task.overdueDays} days (${this.calculateWorkingTime(task.overdueDays)} hours)`
        );
      }

      console.log("-".repeat(20));
    });
  }
}