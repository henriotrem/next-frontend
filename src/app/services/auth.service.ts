import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {ConstantsService} from "./constants.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuth$ = new BehaviorSubject<boolean>(false);
  token: string;
  userId: string;

  constructor(private constantsService: ConstantsService, private router: Router,
              private http: HttpClient) {}

  signUp(email: string, password: string) {
    return new Promise((resolve, reject) => {
      this.http.post(
        this.constantsService.baseAppUrl + '/api/auth/signup',
        { email: email, password: password })
        .subscribe(
          () => {
            this.logIn(email, password).then(
              () => {
                resolve();
              }
            ).catch(
              (error) => {
                reject(error);
              }
            );
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  logIn(email: string, password: string) {
    return new Promise((resolve, reject) => {
      this.http.post(
        this.constantsService.baseAppUrl + '/api/auth/login',
        { email: email, password: password })
        .subscribe(
          (authData: { token: string, userId: string }) => {
            this.token = authData.token;
            this.userId = authData.userId;
            this.isAuth$.next(true);
            resolve();
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  logOut() {
    this.isAuth$.next(false);
    this.userId = null;
    this.token = null;
  }
}
