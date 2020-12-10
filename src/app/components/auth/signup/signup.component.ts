import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signUpForm: FormGroup;
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
    this.signUpForm = this.formBuilder.group({
      firstname: [null, [Validators.required]],
      lastname: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required]
    });
  }

  onSignUp(): void {
    this.loading = true;
    const firstname = this.signUpForm.get('firstname').value;
    const lastname = this.signUpForm.get('lastname').value;
    const email = this.signUpForm.get('email').value;
    const password = this.signUpForm.get('password').value;

    this.authService.signUp(firstname, lastname, email, password)
      .subscribe(() => this.authService.logIn(email, password)
          .subscribe((authData) => {
              this.authService.setSession(authData);
              this.router.navigate(['/timeline']);
            },
            (error) => console.log(error)),
        (error) => console.log(error));
  }
}
