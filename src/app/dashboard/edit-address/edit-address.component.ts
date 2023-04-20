import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Subscription } from 'rxjs';
import { AddressesService } from 'src/app/checkout/addresses/addresses.service';
import { CommonConstants } from 'src/app/constants/common-constants';
import { District, Province, Ward } from 'src/app/model/province.model';
import { EmptyValidator } from 'src/validators/emailOrPhone.validator';

@Component({
  selector: 'app-edit-address',
  templateUrl: './edit-address.component.html',
  styleUrls: ['./edit-address.component.scss'],
})
export class EditAddressComponent implements OnInit {
  provinces: Province[] = [];
  districts: District[] = [];
  wards: Ward[] = [];
  formAddress!: FormGroup;
  loadingProvince = false;
  loadingDistrict = false;
  loadingWard = false;
  isVisibleModal = false;
  address!: string;
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
      this.modal.destroy({
        wardCode: value.ward.code,
        ward: value.ward.name,
        districtCode: value.district.code,
        district: value.district.name,
        provinceCode: value.province.code,
        province: value.province.name,
        detail: value.detail,
      });
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
  showModal() {
    this.isVisibleModal = true;
  }
  ngOnDestroy() {}
}
