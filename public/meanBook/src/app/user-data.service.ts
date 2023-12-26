import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { User } from './user.service';
import { Token } from './token.service';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor(private _http: HttpClient) { }
  baseUrl =environment.base_url;

  private _getUserJson(user: User) {
    return { "name": user.name, "username": user.username, "password": user.password }
  }

  public registerUser(user: User): Observable<User> {
    const url = this.baseUrl + "users/";
    const userToRegister = this._getUserJson(user);
    return this._http.post<User>(url, userToRegister);
  }
  public loginUser(user: User): Observable<Token> {
    const url = this.baseUrl + "users/login";
    const userToLogin = this._getUserJson(user);
    return this._http.post<Token>(url, userToLogin);
  }

}
