import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { UserDataService } from '../user-data.service';
import { User } from '../user.service';
import { AuthenticationService } from '../authentication.service';
import { environment } from 'src/environments/environment.development';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  username!: string;
  password!: string;
  @ViewChild('loginForm', { static: true }) loginForm!: NgForm;
  loginData = {
    name: '',
    username: '',
    password: ''
  }
  constructor(private _userDataService: UserDataService, private _authenticationService: AuthenticationService, private _router: Router) { }
  ngOnInit(): void {
    this._loadConstantsFromEnvironment();
  }

  _loadConstantsFromEnvironment() {
    this.username = environment.Username;
    this.password = environment.Password;

  }
  submitLoginForm(): void {

    const loginDataFromForm = this.loginForm.value;
    const loginUser: User = new User("", loginDataFromForm.username, loginDataFromForm.password);
    this._userDataService.loginUser(loginUser).subscribe({
      next: (token) => {
        this._authenticationService.addUserToken(token.token);
        this.loginForm.reset();
        this._router.navigate(['/profile']);

      },
      error: () => {
        console.log("login failed");
        this.loginForm.reset();
      }
    })
  }
  isLoggedIn(): Boolean {
    return this._authenticationService.getLoggedIn();
  }


}
