import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { lastValueFrom, map, Observable, Subject } from 'rxjs';
import { RequestService } from 'src/app/common-services/request.service';
import { CustomerDto } from 'src/app/model/CustomerDto.model';
import { SearchOption } from 'src/app/model/search-option.model';
import { environment } from 'src/environments/environment';
import { JwtService } from 'src/app/common-services/jwt.service';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root',
})
export class CustomerOnlineService {
  apiCustomer = `${environment.baseUrl}/api/user`;
  customer$ = new Subject<CustomerDto>();
  currentCustomer!: CustomerDto;
  constructor(
    private requestService: RequestService,
    private message: NzMessageService,
    private readonly jwtService: JwtService,  ) {}


  getAllCustomer(search: SearchOption) {
    return this.requestService
      .get(
        `${this.apiCustomer}/customer/getAll?offset=${search.offset}&limit=${search.limit}&status=${search.status}&search=${search.searchTerm}`,
        'lấy danh sách khách hàng'
      )
      .pipe(
        map((res) => {
          if (res.code == '000') {
            return res.data;
          } else {
            Swal.fire({
              title: 'Error!',
              text: 'Lỗi lấy danh sách khách hàng!',
              icon: 'error',
              confirmButtonText: 'Đóng',
            });
            return false;
          }
        })
      );
  }

  getListCustomer(): Observable<any> {
    return this.requestService
      .get(`${this.apiCustomer}/customer/getList`, 'lấy danh sách khách hàng')
      .pipe(
        map((res) => {
          if (res.code == '000') {
            return res.data;
          } else {
            Swal.fire({
              title: 'Error!',
              text: 'Lỗi lấy danh sách khách hàng!',
              icon: 'error',
              confirmButtonText: 'Đóng',
            });
            return false;
          }
        })
      );
  }

  updateCustomer(customer: CustomerDto) {
    return this.requestService
      .put(
        `${this.apiCustomer}/customer/update`,
        customer,
        'cập nhật thông tin khách hàng'
      )
      .pipe(
        map((res) => {
          if ((res.code = '000')) {
            this.message.success('Cập nhật thông tin khách hàng thành công');
            this.jwtService.setJwtToken(res.data.token);
            return true;
          } else {
            this.message.error('Lỗi cập nhật thông tin khách hàng');
            return false;
          }
        })
      );
  }
}
