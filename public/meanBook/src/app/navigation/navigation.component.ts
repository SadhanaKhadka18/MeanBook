import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})

export class NavigationComponent {
  constructor(private _router: Router, private _authenticationService: AuthenticationService) {
  }
  onHome(): void {
    this._router.navigate([''])
  }

  isLoggedIn(): Boolean {
    return this._authenticationService.getLoggedIn();
  }

  logout(): void {
    this._authenticationService.addUserToken("");
    this._router.navigate(['/login/']);
  }

}
