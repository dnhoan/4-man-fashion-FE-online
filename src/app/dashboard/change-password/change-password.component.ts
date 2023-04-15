import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangePassService } from 'src/app/service/change-pass.service';
import { customerStore } from '../customer.repository';
import { CustomerDto } from 'src/app/model/CustomerDto.model';
import { Subscription } from 'rxjs';
import { PasswordValidator } from 'src/validators/emailOrPhone.validator';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ProfileDetailsComponent } from '../profile-details/profile-details.component';

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
  customer!: CustomerDto;
  subCustomer!: Subscription;

  constructor(private fb: FormBuilder,
    private changepassService: ChangePassService,
    private message: NzMessageService) {}

  ngOnInit() {
    this.subCustomer = customerStore.subscribe((res: any) => {
      if (res.customer) {
        this.customer = res.customer as CustomerDto;
      }
    });

    this.formChangePassWord = this.fb.group({
      password: ['', [Validators.required]],
      newPassword: ['', Validators.required,Validators.compose([PasswordValidator()])],
      rePassword: ['',Validators.required],
    });
  }

  onSubmit(){
    let value = this.formChangePassWord.value;
    let data: DataChangePass = {
      password: value.password,
      newPassword: value.newPassword,
      rePassword: value.rePassword,
    };
    this.changepassService.changePass(this.customer.email,data).subscribe(res =>{
      this.message.success(res);
    });
  }
}
