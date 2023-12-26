import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from './authentication.service';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

  constructor(private _autheticationService: AuthenticationService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this._autheticationService.token.token;
    if (token) {
      const modifiedRequest = request.clone({
        setHeaders: {
          "authorization": 'bearer ' + token
        }
      });
      return next.handle(modifiedRequest);
    } else {
      return next.handle(request);
    }
  }
}
