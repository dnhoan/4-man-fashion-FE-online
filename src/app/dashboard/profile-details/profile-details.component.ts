import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CustomerDto } from 'src/app/model/CustomerDto.model';
import { customerStore } from '../customer.repository';
import { CustomerOnlineService } from './customer.service';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss'],
})
export class ProfileDetailsComponent implements OnInit {
  customer!: CustomerDto;
  subCustomer!: Subscription;
  formProfile!: FormGroup;
  submit = false;
  constructor(
    private fb: FormBuilder,
    readonly router: Router,
    private customerService: CustomerOnlineService
  ) { }
  ngOnDestroy() {
    this.subCustomer.unsubscribe();
  }

  ngOnInit() {
    this.customerService.getListCustomer();
    this.initForm();

    this.subCustomer = customerStore.subscribe((res: any) => {
      if (res.customer) {
        this.customer = res.customer as CustomerDto;
        this.fillValueForm();
      }
    });
  }

  initForm() {
    this.formProfile = this.fb.group({
      id: null,
      customerName: ['', [Validators.required]],
      phoneNumber: [
        '',
        [
          Validators.required,
          Validators.pattern('(84|0[3|5|7|8|9])+([0-9]{8})'),
        ],
      ],
      avatar: [''],
      birthday: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      gender: [''],
      note: [''],
      address: [''],
      status: [''],
    });
  }
  fillValueForm() {
    let bd;
    if (this.customer.birthday) bd = this.formatDate(this.customer.birthday);
    else bd = null;
    this.formProfile.patchValue({
      id: this.customer.id,
      customerName: this.customer.customerName,
      phoneNumber: this.customer.phoneNumber,
      birthday: bd,
      gender: this.customer.gender,
      email: this.customer.email,
      note: this.customer.note,
      address: this.customer.address,
      status: this.customer.status,
    });
  }
  addValueCustomer() {
    this.customer.id = this.formProfile.value.id;
    this.customer.customerName = this.formProfile.value.customerName;
    this.customer.phoneNumber = this.formProfile.value.phoneNumber;
    this.customer.avatar = this.formProfile.value.avatar;
    this.customer.birthday = this.formProfile.value.birthday;
    this.customer.gender = this.formProfile.value.gender;
    this.customer.note = this.formProfile.value.note;
    this.customer.address = this.formProfile.value.address;
    this.customer.email = this.formProfile.value.email;
    this.customer.status = this.formProfile.value.status;
  }

  update() {
    this.submit = true;
    if (this.formProfile.valid) {
      this.addValueCustomer();
      this.customerService.updateCustomer(this.customer).subscribe((res) => {
        if (res) {
          this.customer = customerStore.getValue().customer as CustomerDto;
        }
      });
    }
  }

  formatDate(date: Date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  reFormatDate(date: Date) {
    var d = new Date(date),
      month = '' + d.getMonth(),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }
}
