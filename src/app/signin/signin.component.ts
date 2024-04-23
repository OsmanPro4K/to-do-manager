import { Component } from '@angular/core';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent {
  containsAt: boolean = false;

  constructor(private backendService: BackendService) {}

  onSignInClicked(event: Event, email: string) {
    event.preventDefault();

    let username = email.split('@')[0];

    this.backendService.signInUser(username, email).subscribe(
      (response) => {
        console.log(response);

        this.backendService.setUser(response.savedUser);
        this.backendService.setUserSignedIn(true);
      },
      (error) => {
        console.error('Error while retrieving data from DB: ', error);
      }
    );
  }

  containsAtSymbol(email: string) {
    this.containsAt = email.includes('@');
  }
}
