import {
  Component,
  Injectable,
  Input,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { Subscription } from 'rxjs';
import { AddressesService } from 'src/app/checkout/addresses/addresses.service';
import { CommonService } from 'src/app/common-services/common.service';
import { CommonConstants } from 'src/app/constants/common-constants';
import { Address } from 'src/app/model/address.model';
import { CustomerDto } from 'src/app/model/CustomerDto.model';
import { District, Province, Ward } from 'src/app/model/province.model';
import {
  EmailValidator,
  EmptyValidator,
  PhoneNumber,
} from 'src/validators/emailOrPhone.validator';
import { customerStore } from '../customer.repository';
import { EditAddressComponent } from '../edit-address/edit-address.component';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
})
export class AddressComponent implements OnInit {
  formAddress!: FormGroup;
  currentCustomer!: CustomerDto;
  isVisibleModal = false;
  currentAddress!: number;
  i_address!: number;
  addresses: Address[] = [];
  address!: Address | null;

  constructor(
    private modalService: NzModalService,
    private viewContainerRef: ViewContainerRef,
    private addressService: AddressesService,
    private commonService: CommonService,
    private modal: NzModalService,
    private modalRef: NzModalRef,
    private fb: FormBuilder
  ) {}
  ngOnInit(): void {
    this.currentCustomer = customerStore.getValue().customer!;
    this.formAddress = this.fb.group({
      address: ['', Validators.required],
      recipientName: ['', Validators.compose([EmptyValidator()])],
      recipientPhone: ['', Validators.compose([PhoneNumber()])],
      recipientEmail: ['', Validators.compose([EmailValidator()])],
    });
    this.addressService
      .getAddressByCustomerId(this.currentCustomer.id)
      .subscribe((res) => {
        this.addresses = res;
      });
  }

  onSubmit() {
    if (this.formAddress.valid) {
      let value = this.formAddress.value;
      let data: Address = {
        detail: value.address.detail,
        id: this.currentAddress,
        wardCode: value.address.wardCode,
        ward: value.address.ward,
        districtCode: value.address.districtCode,
        district: value.address.district,
        provinceCode: value.address.provinceCode,
        province: value.address.province,
        status: CommonConstants.STATUS.ACTIVE,
        recipientEmail: value.recipientEmail,
        recipientName: value.recipientName,
        recipientPhone: value.recipientPhone,
      };
      if (this.currentAddress >= 0) {
        this.addressService.updateCustomerAddress(data).subscribe((res) => {
          if (res) {
            this.addresses[this.i_address] = res;
            this.commonService.success(
              'Cập nhật địa chỉ người dùng thành công!'
            );
            this.isVisibleModal = false;
            this.formAddress.reset();
            this.i_address = -1;
          }
        });
      } else {
        let customer = customerStore.getValue().customer;
        this.addressService
          .createCustomerAddress(customer?.id!, data)
          .subscribe((res) => {
            this.commonService.success('Thêm địa chỉ người dùng thành công!');
            this.addresses.unshift(res);
            this.isVisibleModal = false;
            this.formAddress.reset();
          });
      }
    }
  }

  removeAddress(address: Address, i: number) {
    this.commonService
      .confirm('Bạn có muốn xóa địa chỉ này không?')
      .then((res) => {
        if (res.isConfirmed) {
          this.addressService
            .deleteAddressById(address.id!)
            .subscribe((res) => {
              if (res) {
                this.addresses.splice(i, 1);
                this.commonService.success('Xóa địa chỉ thành công');
              }
            });
        }
      });
  }
  showModal(address: Address, i: number) {
    this.i_address = i;
    this.currentAddress = address.id!;
    this.isVisibleModal = true;
    this.address = { ...address };
    this.formAddress.patchValue({
      address,
      recipientName: address.recipientName,
      recipientPhone: address.recipientPhone,
      recipientEmail: address.recipientEmail,
    });
  }
  openModalAdd() {
    this.i_address = -1;
    this.currentAddress = -1;
    this.address = null;
    this.formAddress.patchValue({
      address: null,
      recipientName: '',
      recipientPhone: '',
      recipientEmail: '',
    });
    this.isVisibleModal = true;
  }

  updateAddress() {
    const modal = this.modal.create({
      nzTitle: 'Cập nhật địa chỉ',
      nzContent: EditAddressComponent,
      nzViewContainerRef: this.viewContainerRef,
      nzFooter: null,
    });
    modal.afterClose.subscribe((result) => {
      if (result) {
        this.address = { ...this.address, ...result };
        this.formAddress.patchValue({
          address: this.address,
        });
      }
    });
  }
  handleCancel(): void {
    this.formAddress.reset();
    this.isVisibleModal = false;
  }
}
