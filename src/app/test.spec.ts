import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TaskService } from './task.service';
import { BackendService } from './backend.service';

describe('TaskService', () => {
  let taskService: TaskService;
  let backendService: BackendService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService, BackendService]
    });

    taskService = TestBed.inject(TaskService);
    backendService = TestBed.inject(BackendService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add a task', () => {
    const expectedMessage = 'Task added successfully';

    // Mock the HTTP request made by TaskService
    const mockResponse = { message: expectedMessage };
    taskService.addTask('Test Task').subscribe(response => {
      expect(response.message).toBe(expectedMessage);
    });

    // Expect a single HTTP POST request to the expected URL
    const req = httpMock.expectOne('http://localhost:3000/api/task');
    expect(req.request.method).toBe('POST');

    // Respond to the request with the mock response
    req.flush(mockResponse);
  });

  it('should edit a task', () => {
    const expectedMessage = 'Task edited successfully';
    const username = 'test';
    const taskID = '66280272b320e93de66ca538'

    // Mock the HTTP request made by TaskService
    const mockResponse = { message: expectedMessage };
    taskService.editTask(username, 'Editted Task', taskID).subscribe(response => {
      expect(response.message).toBe(expectedMessage);
    });

    // Expect a single HTTP POST request to the expected URL
    const req = httpMock.expectOne(
      'http://localhost:3000/api/task-edit'
    );
    expect(req.request.method).toBe('POST');

    // Respond to the request with the mock response
    req.flush(mockResponse);
  });

  it('should delete a task', () => {
    const expectedMessage = "Task deleted successfully";
    const mockResponse = { message: expectedMessage };
    const taskID = '66280272b320e93de66ca538';
    const username = 'test';

    // Subscribe to the deleteTask method
    taskService.deleteTask(username, taskID).subscribe(response => {
      expect(response.message).toBe(expectedMessage);
    });

    // Expect one HTTP request to the specified URL with the DELETE method
    const req = httpMock.expectOne(
      `http://localhost:3000/api/task?username=${username}&taskID=${taskID}`
    );
    expect(req.request.method).toBe('DELETE');

    // Respond to the request with the mock response
    req.flush(mockResponse);
  });

  it('should sign in a user', () => {
    const expectedMessage = "User saved successfully";
    const mockResponse = { message: expectedMessage };
    const email = 'test@test.com'
    const username = email.split('@')[0];

    // Subscribe to the deleteTask method
    backendService.signInUser(username, email).subscribe(response => {
      expect(response.message).toBe(expectedMessage);
    });

    // Expect one HTTP request to the specified URL with the DELETE method
    const req = httpMock.expectOne(
      `http://localhost:3000/api/signin`
    );
    expect(req.request.method).toBe('POST');

    // Respond to the request with the mock response
    req.flush(mockResponse);
  });
});
