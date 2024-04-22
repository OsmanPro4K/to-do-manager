import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TaskService } from '../task.service';

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

  constructor(private taskService: TaskService) {}
  ngOnInit(): void {
    this.taskService.getShowEditInput().subscribe((booleanValue) => {
      this.showEditTask = booleanValue;
    });

    this.taskService.getEnableDarkMode().subscribe((booleanValue) => {
      this.isDarkModeEnabled = booleanValue;
    });

    this.taskService.getTask().subscribe(task => {
      this.taskThatNeedsEditing = task;
    })
  }

  onAddTaskClicked(event: Event, task: string) {
    event.preventDefault();

    this.taskService.addTask(task);
    this.taskInput.nativeElement.value = '';
  }

  onEditTaskConfirmedClicked(event: Event, edittedTask: string) {
    event.preventDefault();
    let index!: number;

    this.taskService.getIndex().subscribe((newIndexNumber) => {
      index = newIndexNumber;
    });

    this.taskService.editTask(index, edittedTask);
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
}
