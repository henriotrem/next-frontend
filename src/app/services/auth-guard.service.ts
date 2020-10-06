import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthService,
              private router: Router) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return Observable.create(
      (observer) => {
        this.authService.isAuth$.subscribe(
          (auth) => {
            if (!auth) {
              this.router.navigate(['/auth', 'login']);
            }
            observer.next(true);
          }
        );
      }
    );
  }
}
