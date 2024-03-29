import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-signin',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  logInForm: FormGroup;
  loading = false;
  errorMessage: string;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.authService.isAuth$
      .subscribe((auth) => {
        if (auth) {
          this.router.navigate(['/timeline']);
        }
      });
    this.initForm();
  }

  initForm(): void {
    this.logInForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required]
    });
  }

  onLogIn(): void {
    this.loading = true;
    const email = this.logInForm.get('email').value;
    const password = this.logInForm.get('password').value;
    this.authService.logIn(email, password)
      .subscribe((authData) => {
          this.authService.setSession(authData);
          this.router.navigate(['/timeline']);
        },
        (error) => console.log(error));
  }

}
