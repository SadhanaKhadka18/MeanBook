import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { User } from '../user.service';
import { UserDataService } from '../user-data.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  name!: string;
  username!: string;
  password!: string;
  showSuccessMessage = false;
  showErrorMessage = false;
  @ViewChild('registrationForm', { static: true }) registrationForm!: NgForm;
  registrationData = {
    name: '',
    username: '',
    password: ''
  }
  constructor(private _userDataService: UserDataService) { }

  ngOnInit(): void {
    this._loadConstantsFromEnvironment();
  }
  _loadConstantsFromEnvironment() {
    this.name = environment.Name;
    this.username = environment.Username;
    this.password = environment.Password;

  }

  submitRegistrationForm(): void {

    if (this.registrationForm.valid) {
      const registrationDatafromForm = this.registrationForm.value;
      const userToRegister = new User(registrationDatafromForm.name, registrationDatafromForm.username, registrationDatafromForm.password);
      this._userDataService.registerUser(userToRegister).subscribe({
        next: (response) => {
          console.log("registration successful");
          this.showSuccessMessage = true;
          this.showErrorMessage = false;
          this.registrationForm.reset();


        },
        error: () => {
          console.log("user registration failed");
          this.showSuccessMessage = false;
          this.showErrorMessage = true;
          this.registrationForm.reset();
        }
      })
    }
  }

}
