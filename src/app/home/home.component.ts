import { Component, Renderer2 } from '@angular/core';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  isDarkModeEnabled!: boolean;

  constructor(private renderer: Renderer2, private taskService: TaskService) {}
  ngOnInit(): void {
    this.taskService.getEnableDarkMode().subscribe(booleanValue => {
      this.isDarkModeEnabled = booleanValue;
    })
  }

  toggleMode() {
    if (this.isDarkModeEnabled == false) {
      this.taskService.setEnableDarkMode(true)
      this.renderer.removeClass(document.body, 'bg-white');
      this.renderer.addClass(document.body, 'bg-dark');
    }
    else {
      this.taskService.setEnableDarkMode(false)
      this.renderer.removeClass(document.body, 'bg-dark');
      this.renderer.addClass(document.body, 'bg-white');
    }
  }
}
