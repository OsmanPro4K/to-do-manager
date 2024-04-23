import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TaskService } from '../task.service';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-task-input',
  templateUrl: './task-input.component.html',
  styleUrls: ['./task-input.component.css'],
})
export class TaskInputComponent implements OnInit {
  @ViewChild('taskInput', { static: false }) taskInput!: ElementRef;
  @ViewChild('editTaskInput', { static: false }) editTaskInput!: ElementRef;


  taskThatNeedsEditing: string = '';

  showEditTask: boolean = false;
  isDarkModeEnabled: boolean = false;
  isEmpty: boolean = true;

  constructor(private taskService: TaskService, private backendService: BackendService) {}
  ngOnInit(): void {
    this.taskService.getShowEditInput().subscribe((booleanValue) => {
      this.showEditTask = booleanValue;
    });

    this.taskService.getEnableDarkMode().subscribe((booleanValue) => {
      this.isDarkModeEnabled = booleanValue;
    });

    // this.taskService.getTask().subscribe(task => {
    //   this.taskThatNeedsEditing = task;
    // })
  }

  onAddTaskClicked(event: Event, task: string) {
    event.preventDefault();

    let username = '';
    this.backendService.getUser().subscribe(userInfo => {
      username = userInfo.username
    })
    this.taskService.addTask(task).subscribe(
      () => {
        // Task added successfully, fetch updated tasks
        this.taskService.fetchTasks(username);
      },
      (error) => {
        console.error('Error adding task:', error);
      }
    );

    this.taskInput.nativeElement.value = '';
  }

  onEditTaskConfirmedClicked(event: Event, edittedTask: string) {
    event.preventDefault();
    let taskID!: number;

    this.taskService.getTaskID().subscribe((newID) => {
      taskID = newID;
    });

    let username = '';
    this.backendService.getUser().subscribe(userInfo => {
      username = userInfo.username
    })
    this.taskService.editTask(edittedTask, taskID).subscribe(
      () => {
        // Task added successfully, fetch updated tasks
        this.taskService.fetchTasks(username);
      },
      (error) => {
        console.error('Error adding task:', error);
      }
    );;
    this.taskService.setShowEditInput(false);

    this.editTaskInput.nativeElement.value = '';
  }

  onCancelEditTaskClicked() {
    this.taskService.setShowEditInput(false);
  }

  toggleMode() {
    if (this.isDarkModeEnabled == false) {
      this.taskService.setEnableDarkMode(true)

    }
    else {
      this.taskService.setEnableDarkMode(false)
    }
  }

  isInputEmpty(inputValue: string) {
    if (inputValue.length > 0) {
      this.isEmpty = false;
    } else {
      this.isEmpty = true
    }
  }
}
