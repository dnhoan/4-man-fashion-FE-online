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
import Swal from 'sweetalert2';
import { AuthService } from '../common-services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit() {
    this.signupForm = this.fb.group({
      phoneOrEmail: ['', Validators.compose([EmailOrPhoneNumber()])],
      password: ['', Validators.compose([PasswordValidator()])],
      confirmPassword: ['', Validators.compose([PasswordValidator()])],
    });
    new FormControl('', Validators.required, this.isUserNameDuplicated);
  }
  onSubmit() {
    let password = this.signupForm.value.password;
    let confirmPassword = this.signupForm.value.confirmPassword;
    if (password != confirmPassword)
      Swal.fire({
        title: 'Error!',
        text: 'Xác nhận mật khẩu chưa chính xác',
        icon: 'error',
        confirmButtonText: 'Đóng',
      });
    else if (this.signupForm.valid) {
      this.authService
        .signup({
          phoneOrEmail: this.signupForm.value.phoneOrEmail,
          password: this.signupForm.value.password,
        })
        .subscribe();
    } else {
      Object.values(this.signupForm.controls).forEach((control) => {
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
