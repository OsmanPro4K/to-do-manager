import { Component, OnInit } from '@angular/core';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent implements OnInit {
  tasks: string[] = [];
  isDarkModeEnabled!: boolean;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.updateTaskList.subscribe((updatedTaskList) => {
      this.tasks = updatedTaskList;
    });

    this.taskService.getEnableDarkMode().subscribe((booleanValue) => {
      this.isDarkModeEnabled = booleanValue;
    });
  }

  onEditTaskClicked(task: string, taskIndex: number) {
    this.taskService.setShowEditInput(true);
    this.taskService.setIndex(taskIndex);
    this.taskService.setTask(task);
  }

  onDeleteTaskClicked(taskIndex: number) {
    this.taskService.deleteTask(taskIndex);
  }

  toggleMode() {
    if (this.isDarkModeEnabled == false) {
      this.taskService.setEnableDarkMode(true);
    } else {
      this.taskService.setEnableDarkMode(false);
    }
  }
}
