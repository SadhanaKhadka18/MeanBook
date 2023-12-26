import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  constructor(private _authenticationService: AuthenticationService, private _route: ActivatedRoute, private _router: Router) { }



  getLoggedInUser(): string | null {
    return this._authenticationService.getUsername();
  }
}
