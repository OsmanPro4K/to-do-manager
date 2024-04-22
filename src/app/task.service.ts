import { EventEmitter, Injectable, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasks: string[] = [];
  private task: BehaviorSubject<string> = new BehaviorSubject<string>('');

  private index: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  private showEditInput: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private enableDarkMode: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @Output() updateTaskList = new EventEmitter<string[]>();

  constructor() {}

  setShowEditInput(show: boolean) {
    this.showEditInput.next(show);
  }
  getShowEditInput() {
    return this.showEditInput;
  }

  setEnableDarkMode(show: boolean) {
    this.enableDarkMode.next(show);
  }
  getEnableDarkMode() {
    return this.enableDarkMode;
  }

  setIndex(newIndexNumber: number) {
    this.index.next(newIndexNumber)
  }
  getIndex() {
    return this.index;
  }

  setTask(task: string) {
    this.task.next(task);
  }
  getTask() {
    return this.task;
  }

  addTask(task: string) {
    console.log('Im in TaskService!\n', task);

    this.tasks.push(task);
    this.updateTaskList.emit(this.tasks);
  }

  editTask(index: number, editedTask: string) {
    this.tasks[index] = editedTask;
  }

  deleteTask(index: number) {
    this.tasks.splice(index, 1);
    this.updateTaskList.emit(this.tasks)
  }
}
