import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../store/actions/auth.actions';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { authFeature } from '../../store/reducers/auth.reducers';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['../styles/index.scss', './log-in.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, AsyncPipe, RouterModule],
})
export class LogInComponent {
  store = inject(Store);
  errorMessage$ = this.store.select(authFeature.selectError);
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.minLength(3)]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
  });

  onSubmit(): void {
    this.store.dispatch(
      AuthActions.logIn({
        email: this.loginForm.value.email ?? '',
        password: this.loginForm.value.password ?? '',
      })
    );
  }
}
