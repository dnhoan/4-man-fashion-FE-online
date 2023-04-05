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
import { EmptyValidator } from 'src/validators/emailOrPhone.validator';
import { customerStore } from '../customer.repository';
import { EditAddressComponent } from '../edit-address/edit-address.component';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
})
export class AddressComponent implements OnInit {
  provinces: Province[] = [];
  districts: District[] = [];
  wards: Ward[] = [];
  selected: any;
  formAddress!: FormGroup;
  loadingProvince = false;
  loadingDistrict = false;
  loadingWard = false;
  currentCustomer!: CustomerDto;
  isVisibleModal = false;
  inputAddress: string = '';
  currentAddresses!: Address;
  currentAddress!: number;
  addresss: Address[] = [];
  inputProvince: string = '';
  inputDistrict: string = '';
  inputWard: string = '';
  inputDetail: string = '';
  subSearchOrder!: Subscription;
  constructor(
    private modalService: NzModalService,
    private viewContainerRef: ViewContainerRef,
    private addressService: AddressesService,
    private commonService: CommonService,
    private modal: NzModalRef,
    private fb: FormBuilder
  ) {}
  ngOnInit(): void {
    this.loadingProvince = true;
    this.addressService.getProvinces().subscribe((res) => {
      this.provinces = res;
      this.loadingProvince = false;
    });
    this.currentCustomer = customerStore.getValue().customer!;
    this.addressService
      .getAddressByCustomerId(this.currentCustomer.id)
      .subscribe((res) => {
        this.addresss = res;
      });
    this.formAddress = this.fb.group({
      province: [null, Validators.required],
      district: [null, Validators.required],
      ward: [null, Validators.required],
      detail: ['', Validators.compose([EmptyValidator()])],
    });
  }

  // editAddress(index: number) {
  //   let addressEdited = this.addresss.forEach(val => addressEdited == val)
  //   if (addressEdited) {
  //     const modal = this.modalService.create({
  //       nzTitle: 'Sửa địa chỉ',
  //       nzContent: EditAddressComponent,
  //       nzViewContainerRef: this.viewContainerRef,
  //       nzComponentParams: {
  //         addressEdited,
  //       },
  //       nzFooter: null,
  //     });
  //     modal.afterClose.subscribe((result) => {
  //       if (result) {
  //         let i = this.addresss.findIndex((a) => a.id == addressEdited.id);
  //         this.commonService.success('Cập nhật địa chỉ thành công');
  //         this.addresss[i] = result;
  //       }
  //     });
  //   } else this.commonService.info('Vui lòng chọn địa chỉ');
  // }

  onSubmit() {
    if (this.formAddress.valid) {
      let value = this.formAddress.value;
      let data: Address = {
        detail: value.detail,
        id: this.currentAddress,
        wardCode: value.ward.code,
        ward: value.ward.name,
        districtCode: value.district.code,
        district: value.district.name,
        provinceCode: value.province.code,
        province: value.province.name,
        status: CommonConstants.STATUS.ACTIVE,
      };

      if (this.currentAddress) {
        console.log(data.id);

        this.addressService.updateCustomerAddress(data).subscribe((res) => {
          this.isVisibleModal = false;
        });
      } else {
        let customer = customerStore.getValue().customer;
        this.addressService
          .createCustomerAddress(customer?.id!, data)
          .subscribe((res) => {
            this.isVisibleModal = false;
          });
      }
    }
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

  removeAddress(address: Address, i: number) {
    this.commonService
      .confirm('Bạn có muốn xóa địa chỉ này không?')
      .then((res) => {
        if (res.isConfirmed) {
          this.addressService
            .deleteAddressById(address.id!)
            .subscribe((res) => {
              if (res) {
                this.addresss.splice(i, 1);
                this.commonService.success('Xóa địa chỉ thành công');
              }
            });
        }
      });
  }
  showModal(idAddress: number): void {
    this.currentAddress = idAddress;
    console.log(this.currentAddress);

    this.isVisibleModal = true;
  }

  handleOk(): void {
    this.onSubmit();
    this.isVisibleModal = false;
  }
  cancel() {
    this.modal.destroy(false);
  }

  handleCancel(): void {
    this.isVisibleModal = false;
  }
}
