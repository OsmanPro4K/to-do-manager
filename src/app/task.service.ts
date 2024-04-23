import { EventEmitter, Injectable, Output } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BackendService } from './backend.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { response } from 'express';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private taskID: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private tasks: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  private task: BehaviorSubject<string> = new BehaviorSubject<string>('');

  private index: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  private showEditInput: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  private enableDarkMode: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  @Output() updateTaskList = new EventEmitter<string[]>();

  constructor(
    private backendService: BackendService,
    private http: HttpClient
  ) {}

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
    this.index.next(newIndexNumber);
  }
  getIndex() {
    return this.index;
  }

  setTaskID(taskId: number) {
    this.taskID.next(taskId);
  }
  getTaskID() {
    return this.taskID;
  }

  setTask(task: string) {
    this.task.next(task);
  }
  getTask() {
    return this.task;
  }

  setTasks(tasks: string[]) {
    console.log(tasks);

    this.tasks.next(tasks);
  }
  getTasks(): Observable<string[]> {
    return this.tasks.asObservable();
  }

  addTask(task: string): Observable<any> {
    let username = '';
    this.backendService.getUser().subscribe((user) => {
      username = user.username;
    });

    const url = 'http://localhost:3000/api/task';
    const body = { username, task };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(url, body, { headers });
  }

  fetchTasks(username: string): void {
    const url = `http://localhost:3000/api/task?username=${username}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http.get(url, { headers }).subscribe(
      (response: any) => {
        console.log(response);
        this.setTasks(response.fetchedTasks);
      },
      (error) => {
        console.error('Error fetching tasks:', error);
      }
    );
  }

  editTask(editedTask: string, taskID: number): Observable<any> {
    let username = '';
    this.backendService.getUser().subscribe((user) => {
      username = user.username;
    });

    console.log(username, editedTask, taskID);


    const url = 'http://localhost:3000/api/task-edit'
    const body = {username, editedTask, taskID}
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(url, body, { headers });;
  }

  deleteTask(taskID: number) {
    let username = '';
    this.backendService.getUser().subscribe((userInfo) => {
      username = userInfo.username;
    });

    const url = `http://localhost:3000/api/task?username=${username}&taskID=${taskID}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http.delete(url, { headers }).subscribe((response) => {
      console.log(response);
    });
  }
}
