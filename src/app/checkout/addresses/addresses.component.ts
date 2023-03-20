import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Subscription } from 'rxjs';
import { CommonConstants } from 'src/app/constants/common-constants';
import { customerStore } from 'src/app/dashboard/customer.repository';
import { Address } from 'src/app/model/address.model';
import { District, Province, Ward } from 'src/app/model/province.model';
import { EmptyValidator } from 'src/validators/emailOrPhone.validator';
import { AddressesService } from './addresses.service';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.scss'],
})
export class AddressesComponent implements OnInit {
  @Input() addressEdited!: Address;
  provinces: Province[] = [];
  districts: District[] = [];
  wards: Ward[] = [];
  formAddress!: FormGroup;
  loadingProvince = false;
  loadingDistrict = false;
  loadingWard = false;
  constructor(
    private addressService: AddressesService,
    private fb: FormBuilder,
    private modal: NzModalRef
  ) {}
  ngOnInit(): void {
    this.loadingProvince = true;
    this.addressService.getProvinces().subscribe((res) => {
      this.provinces = res;
      this.loadingProvince = false;
    });
    if (this.addressEdited) {
      // this.formAddress = this.fb.group({
      //   province: [
      //     {
      //       name: this.addressEdited.province,
      //       code: this.addressEdited.provinceCode,
      //     },
      //     Validators.required,
      //   ],
      //   district: [
      //     {
      //       name: this.addressEdited.district,
      //       code: this.addressEdited.districtCode,
      //     },
      //     ,
      //     Validators.required,
      //   ],
      //   ward: [
      //     {
      //       name: this.addressEdited.ward,
      //       code: this.addressEdited.provinceCode,
      //     },
      //     ,
      //     Validators.required,
      //   ],
      //   detail: ['', Validators.compose([EmptyValidator()])],
      // });
    } else {
    }
    this.formAddress = this.fb.group({
      province: [null, Validators.required],
      district: [null, Validators.required],
      ward: [null, Validators.required],
      detail: ['', Validators.compose([EmptyValidator()])],
    });
  }
  onSubmit() {
    if (this.formAddress.valid) {
      let value = this.formAddress.value;
      let data: Address = {
        detail: value.detail,
        id: 0,
        wardCode: value.ward.code,
        ward: value.ward.name,
        districtCode: value.district.code,
        district: value.district.name,
        provinceCode: value.province.code,
        province: value.province.name,
        status: CommonConstants.STATUS.ACTIVE,
      };
      if (this.addressEdited) {
        // update
        data.id = this.addressEdited.id;
        this.addressService.updateCustomerAddress(data).subscribe((res) => {
          this.modal.destroy(res);
        });
      } // create
      else {
        let customer = customerStore.getValue().customer;
        this.addressService
          .createCustomerAddress(customer?.id!, data)
          .subscribe((res) => {
            this.modal.destroy(res);
          });
      }
    }
  }
  cancel() {
    this.modal.destroy(false);
  }
  onChangeProvince(province: Province) {
    this.loadingDistrict = true;
    this.formAddress.patchValue({
      district: null,
      ward: null,
    });
    this.districts = [];
    this.wards = [];
    this.addressService.getDistricts(province.code!).subscribe((res) => {
      this.districts = res;
      this.loadingDistrict = false;
    });
  }
  onChangeDistrict(district: District) {
    if (district) {
      this.loadingWard = true;
      this.formAddress.patchValue({
        ward: null,
      });
      this.wards = [];
      this.addressService.getWards(district.code!).subscribe((res) => {
        this.wards = res;
        this.loadingWard = false;
      });
    }
  }
  onChangeWard(ward: Ward) {
    console.log(this.formAddress.value);
  }
  ngOnDestroy() {}
}
