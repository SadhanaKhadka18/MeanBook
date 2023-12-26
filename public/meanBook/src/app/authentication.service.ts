import { Injectable, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Token } from './token.service';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  token: Token = new Token();
  constructor() { }

  public addUserToken(token: string) {
    this.token.token = token;
    localStorage.setItem("token", token);
  }
  public getLoggedIn(): Boolean {
    const storedToken = localStorage.getItem("token");
    this._setToken();
    return !!storedToken;
  }
  public getUsername(): string | null {
    this._setToken();
    return this.token.getLoggedInUsername()
  }

  _setToken() {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      this.token = new Token();
      this.token.token = storedToken;
    }
  }

}
