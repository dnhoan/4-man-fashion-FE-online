import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { CommonService } from 'src/app/common-services/common.service';
import { RequestService } from 'src/app/common-services/request.service';
import { Address } from 'src/app/model/address.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AddressesService {
  constructor(
    private requestService: RequestService,
    private commonService: CommonService
  ) {}
  getProvinces() {
    return this.requestService
      .get(`${environment.baseProvinces}/api/p/?q=*`, 'lấy địa chỉ')
      .pipe(
        map((res) => {
          if (res) {
            return res;
          } else {
            this.commonService.error('Lỗi lấy danh sách lấy địa chỉ');
            return false;
          }
        })
      );
  }
  getDistricts(province_code: number) {
    return this.requestService
      .get(
        `${environment.baseProvinces}/api/d/search/?p=${province_code}&q=*`,
        'lấy địa chỉ'
      )
      .pipe(
        map((res) => {
          if (res) {
            return res;
          } else {
            this.commonService.error('Lỗi lấy danh sách lấy địa chỉ');
            return false;
          }
        })
      );
  }
  getWards(district_code: number) {
    return this.requestService
      .get(
        `${environment.baseProvinces}/api/w/search/?d=${district_code}&q=*`,
        'lấy địa chỉ'
      )
      .pipe(
        map((res) => {
          if (res) {
            return res;
          } else {
            this.commonService.error('Lỗi lấy danh sách lấy địa chỉ');
            return false;
          }
        })
      );
  }
  getAddressByCustomerId(customerId: number) {
    return this.requestService
      .get(
        `${environment.baseUrl}/api/user/customerAddress/getList/${customerId}`,
        'lấy địa chỉ'
      )
      .pipe(
        map((res) => {
          if (res.code == '000') {
            return res.data;
          } else {
            this.commonService.error('Lỗi lấy danh sách lấy địa chỉ');
            return false;
          }
        })
      );
  }
  deleteAddressByCustomerId(customerId: number) {
    return this.requestService
      .delete(
        `${environment.baseUrl}/api/user/customerAddress/delete/${customerId}`,
        'xóa địa chỉ'
      )
      .pipe(
        map((res) => {
          if (res.code == '000') {
            return true;
          } else {
            this.commonService.error('Lỗi lấy xóa địa chỉ');
            return false;
          }
        })
      );
  }

  createCustomerAddress(customerId: number, address: Address) {
    return this.requestService
      .post(
        `${environment.baseUrl}/api/user/customerAddress/create/${customerId}`,
        address,
        'thêm địa chỉ khách hàng'
      )
      .pipe(
        map((res) => {
          if (res.code == '000') {
            return res.data;
          }
          this.commonService.error('Lỗi thêm địa chỉ');
          return false;
        })
      );
  }
  updateCustomerAddress(address: Address) {
    return this.requestService
      .put(
        `${environment.baseUrl}/api/user/customerAddress/update`,
        address,
        'cập nhật địa chỉ khách hàng'
      )
      .pipe(
        map((res) => {
          if (res.code == '000') {
            return res.data;
          }
          this.commonService.error('Lỗi cập nhật địa chỉ');
          return false;
        })
      );
  }
}
