import { Component, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-database',
  templateUrl: './database.component.html',
  styleUrls: ['./database.component.css']
})
export class DatabaseComponent implements OnInit {
  users: any[] = []; // Initialize an array to store users
  isDarkModeEnabled!: boolean;

  constructor(private backendService: BackendService, private taskService: TaskService) {}

  ngOnInit(): void {
    this.backendService.getAllUsers().subscribe(
      (response) => {
        console.log(response);
        this.users = response.allUsers; // Assign the fetched users to the component property
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );

    this.taskService.getEnableDarkMode().subscribe(booleanValue => {
      this.isDarkModeEnabled = booleanValue
    })
  }

  toggleMode() {
    if (this.isDarkModeEnabled == false) {
      this.taskService.setEnableDarkMode(true);
    } else {
      this.taskService.setEnableDarkMode(false);
    }
  }
}
