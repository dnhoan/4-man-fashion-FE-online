import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import {
  EmailOrPhoneNumber,
  PasswordValidator,
} from 'src/validators/emailOrPhone.validator';
import { AuthService } from '../common-services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      phoneOrEmail: ['', Validators.compose([EmailOrPhoneNumber()])],
      password: ['', Validators.compose([PasswordValidator()])],
    });
    new FormControl('', Validators.required, this.isUserNameDuplicated);
  }
  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService
        .login({
          phoneOrEmail: this.loginForm.value.phoneOrEmail,
          password: this.loginForm.value.password,
        })
        .subscribe();
        localStorage.setItem("phoneOrEmail", this.loginForm.value.phoneOrEmail)
    } else {
      Object.values(this.loginForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  isUserNameDuplicated(
    control: AbstractControl
  ): Observable<ValidationErrors | null> {
    return of(null);
  }
}
