import { Component, OnInit } from '@angular/core';
import { TaskService } from '../task.service';
import { BackendService } from '../backend.service';
import { User } from '../User';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  user!: User;

  isUserSigned!: boolean;
  isDarkModeEnabled!: boolean;

  constructor(private taskService: TaskService, private backendService: BackendService) {}

  ngOnInit(): void {
      this.taskService.getEnableDarkMode().subscribe(booleanValue => {
        this.isDarkModeEnabled = booleanValue
      })

      this.backendService.getUser().subscribe(user => {
        this.user = user
      })

      this.backendService.getUserSignedIn().subscribe(booleanValue => {
        this.isUserSigned = booleanValue;
      })
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
