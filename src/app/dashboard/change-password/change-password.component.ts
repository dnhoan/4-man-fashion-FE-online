import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangePassService } from 'src/app/service/change-pass.service';
import { customerStore } from '../customer.repository';
import { CustomerDto } from 'src/app/model/CustomerDto.model';
import { Subscription } from 'rxjs';
import { PasswordValidator } from 'src/validators/emailOrPhone.validator';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ProfileDetailsComponent } from '../profile-details/profile-details.component';
import { Router } from '@angular/router';

export interface DataChangePass {
  password: string;
  newPassword: string;
  rePassword: string;
}

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})

export class ChangePasswordComponent implements OnInit {
  formChangePassWord!: FormGroup;
  submit = false;
  customer!: CustomerDto;
  subCustomer!: Subscription;

  constructor(private fb: FormBuilder,
    private changepassService: ChangePassService,
    private message: NzMessageService,
    private router: Router) { }

  ngOnInit() {
    this.subCustomer = customerStore.subscribe((res: any) => {
      if (res.customer) {
        this.customer = res.customer as CustomerDto;
      }
    });

    this.initForm();
  }

  changePass() {
    this.submit = true;
    let value = this.formChangePassWord.value;
    let data: DataChangePass = {
      password: value.password,
      newPassword: value.newPassword,
      rePassword: value.rePassword,
    };
    if (this.formChangePassWord.value) {
      this.changepassService.changePass(this.customer.email, data).subscribe(res => {
        if (res.code === '000') {
          this.message.success(`${res.data}`);
          this.defaultValueForm();
        } else {
          this.message.error(`${res.desc}`);
        }
      });
    }
  }

  defaultValueForm(){
    console.log(1);
    this.submit = false;
    this.formChangePassWord.reset();
  }

  initForm() {
    this.formChangePassWord = this.fb.group({
      password: ['', [Validators.required]],
      newPassword: ['', Validators.required, Validators.compose([PasswordValidator()])],
      rePassword: ['', Validators.required],
    });
  }
}
