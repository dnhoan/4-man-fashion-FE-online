import { ChangePassService } from 'src/app/service/change-pass.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})


export class ForgotPasswordComponent implements OnInit {
  email!: string;
  formGetOTP!: FormGroup
  constructor(
    private fb: FormBuilder,
    private changePassService: ChangePassService,
    private message: NzMessageService,
    private router: Router) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.formGetOTP = this.fb.group({
      email: ['', Validators.email],
    });
  }

  forgot() {
    this.changePassService.getOTP(this.formGetOTP.value.email).subscribe(res => {
      if (res.code === '000') {
        this.message.success(`${res.data}`)
        localStorage.setItem('email',`${this.formGetOTP.value.email}`)
        this.router.navigate(['reset-password'])
      } else {
        this.message.error(`${res.desc}`);
      }

    })
  }

}
