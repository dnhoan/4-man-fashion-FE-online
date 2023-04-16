import { ChangePassService } from 'src/app/service/change-pass.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasswordValidator } from 'src/validators/emailOrPhone.validator';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';

export interface DataResetPass {
  isOtp: string;
  newPassword: string;
  rePassword: string;
}

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  formReset!: FormGroup
  submit = false;

  constructor(private fb: FormBuilder,
    private changePassService: ChangePassService,
    private message: NzMessageService,
    private router: Router) { }

  ngOnInit() {
    this.initForm();
  }

  resetPass() {
    this.submit = true;
    let value = this.formReset.value;
    let data: DataResetPass = {
      isOtp: value.isOtp,
      newPassword: value.newPassword,
      rePassword: value.rePassword,
    };
    let email: any = localStorage.getItem('email');
    this.changePassService.resetPassword(email, data).subscribe(res => {
      if (res.code === '000') {
        this.message.success(`${res.data}`)
        this.router.navigate(['login']);
      } else {
        this.message.error(`${res.desc}`);
      }
    });
  }

  initForm() {
    this.formReset = this.fb.group({
      isOtp: ['', Validators.required],
      newPassword: ['', Validators.required, Validators.compose([PasswordValidator()])],
      rePassword: ['', Validators.required],
    });

  }

}
