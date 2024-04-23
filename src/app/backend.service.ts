import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from './User';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  private user: BehaviorSubject<User> = new BehaviorSubject<User>({
    username: '',
    email: '',
  });
  private userSignedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor(private http: HttpClient) {}

  setUser(user: User) {
    this.user.next(user);
    console.log(user);
  }
  getUser() {
    return this.user;
  }

  setUserSignedIn(userSignedIn: boolean) {
    this.userSignedIn.next(userSignedIn);
  }
  getUserSignedIn() {
    return this.userSignedIn;
  }

  signInUser(username: string, email: string): Observable<any> {
    const url = 'http://localhost:3000/api/signin';
    const body = { username, email };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(url, body, { headers });
  }

  getAllUsers(): Observable<any> {
    const url = 'http://localhost:3000/api/all-users-tasks';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.get(url, {headers})
  }
}
