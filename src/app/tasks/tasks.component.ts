import { Component, OnInit } from '@angular/core';
import { TaskService } from '../task.service';
import { BackendService } from '../backend.service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent implements OnInit {
  tasks: {task: string, _id: number}[] = [];
  isDarkModeEnabled!: boolean;

  constructor(private taskService: TaskService, private backendService: BackendService) {}

  ngOnInit(): void {
    let username = '';
    this.backendService.getUser().subscribe(userInfo => {
      username = userInfo.username;
      this.taskService.fetchTasks(username); // Fetch tasks after getting the username
    });

    this.taskService.getTasks().subscribe((updatedTaskList: any) => {
      console.log(updatedTaskList);
      this.tasks = updatedTaskList
      console.log(this.tasks);

    });

    this.taskService.getEnableDarkMode().subscribe((booleanValue) => {
      this.isDarkModeEnabled = booleanValue;
    });
  }

  onEditTaskClicked(task: string, taskIndex: number, taskID: number) {
    this.taskService.setShowEditInput(true);
    this.taskService.setIndex(taskIndex);
    this.taskService.setTask(task);
    this.taskService.setTaskID(taskID)
  }

  onDeleteTaskClicked(taskID: number, taskIndex: number) {
    let username = '';
    this.backendService.getUser().subscribe((userInfo) => {
      username = userInfo.username;
    });
    this.taskService.deleteTask(username, taskID);
    this.tasks.splice(taskIndex, 1)
  }

  toggleMode() {
    if (this.isDarkModeEnabled == false) {
      this.taskService.setEnableDarkMode(true);
    } else {
      this.taskService.setEnableDarkMode(false);
    }
  }
}
