import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { CommonService } from 'src/app/common-services/common.service';
import { RequestService } from 'src/app/common-services/request.service';
import { OrderDto } from 'src/app/model/orderDto.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  constructor(
    private requestService: RequestService,
    private commonService: CommonService
  ) {}

  createOrder(order: OrderDto) {
    return this.requestService
      .post(
        `${environment.baseUrl}/api/user/order/create`,
        order,
        'tạo đơn hàng'
      )
      .pipe(
        map((res) => {
          if (res.code == '000') {
            return res.data;
          }
          this.commonService.error('Lỗi tạo đơn hàng');
          return false;
        })
      );
  }
}
