import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of, Subscription } from 'rxjs';
import { map, tap, filter, delay, finalize } from 'rxjs/operators';

import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  formLogin: FormGroup;
  loginSuscription: Subscription;
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    public formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
  ) {
    this.formLogin = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]],
    });
    // this.testingRxJSOperators();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.loginSuscription?.unsubscribe();
  }

  onNavigateToRegisterPage(): void {
    this.router.navigate(['/register']);
  }

  login() {
    this.loading = true;

    this.loginSuscription = this.authService
      .loginWithUserCredentials(this.formLogin.value.email, this.formLogin.value.password)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe(
        (data) => {
          this.router.navigate(['/movies']);
        },
        (error) => {
          this.handleError(error);
        },
        () => {
          console.log("el servicio respondio correctamente")
        }
      );

  }

  testingRxJSOperators(): void {
    of(
      { id: 100, nickname: 'user001' },
      { id: 200, nickname: 'user003' },
      { id: 300, nickname: 'user004' },
    )
    .pipe(
      tap(u => console.log('user', u)),
      filter(u => u.nickname !== 'user003'),
      map(u => u.nickname),
      delay(3000),
    )
    .subscribe((data) => console.log(data))
  }

  handleError (error) {
    let errorMessage = ''
    if (error.status === 401) {
      errorMessage = 'Invalid credentials';
    } else {
      errorMessage = 'Ups! Something went wrong';
    }
    this.snackBar.open(errorMessage, 'OK', {
      duration: 3000,
    });
  }

}
