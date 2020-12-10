import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {BehaviorSubject, Subject} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {ConstantsService} from './constants.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuth$ = new BehaviorSubject<boolean>(false);

  constructor(private constantsService: ConstantsService,
              private router: Router,
              private http: HttpClient) {

    this.isLoggedIn();
  }

  getAccount(): any {
    return this.http.get(this.constantsService.baseAppUrl + '/api/auth/account');
  }

  signUp(firstname: string, lastname: string, email: string, password: string): any {

    const account = {
      firstname,
      lastname,
      email,
      password
    };

    return this.http.post(this.constantsService.baseAppUrl + '/api/auth/signup', account);
  }

  logIn(email: string, password: string): any {

    return this.http.post(this.constantsService.baseAppUrl + '/api/auth/login', {email, password});
  }

  setSession(authResult): void {
    const expiresAt = moment().add(authResult.expiresIn, 'second');

    localStorage.setItem('id_token', authResult.token);
    localStorage.setItem('user_id', authResult.userId);
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()) );

    this.isAuth$.next(true);
  }

  logOut(): void {
    localStorage.removeItem('id_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('expires_at');

    this.isAuth$.next(false);
  }

  isLoggedIn(): void {

    if (!moment().isBefore(this.getExpiration())) {
      this.logOut();
    } else {
      this.isAuth$.next(true);
    }
  }

  getExpiration(): any {
    const expiration = localStorage.getItem('expires_at');
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }
}
