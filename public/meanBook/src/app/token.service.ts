import { JwtHelperService } from '@auth0/angular-jwt';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Token {
  #token: string = '';
  private jwtHelper: JwtHelperService;

  constructor() {
    this.jwtHelper = new JwtHelperService();
  }

  set token(token: string) {
    this.#token = token;
  }

  get token() {
    return this.#token;
  }

  getLoggedInUsername() {
    const decodedToken = this.jwtHelper.decodeToken(this.#token);
    if (decodedToken && decodedToken.username) {
      return decodedToken.username;
    } else {
      return null;
    }
  }
}
