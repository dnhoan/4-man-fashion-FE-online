import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { CommonService } from 'src/app/common-services/common.service';
import { RequestService } from 'src/app/common-services/request.service';
import { OrderDto } from 'src/app/model/orderDto.model';
import { SearchOption } from 'src/app/model/search-option.model';
import { UpdateStatus } from 'src/app/model/updateStatus.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  constructor(
    private requestService: RequestService,
    private commonService: CommonService
  ) {}
  getOrderByCustomerId(search: SearchOption, customerId: number) {
    return this.requestService
      .get(
        `${environment.baseUrl}/api/user/orders/${customerId}?offset=${search.offset}&limit=${search.limit}&status=${search.status}&search=${search.searchTerm}`,
        'lấy danh sách đơn hàng'
      )
      .pipe(
        map((res) => {
          if (res.code == '000') {
            return res.data;
          } else {
            this.commonService.error('Lỗi lấy danh sách đơn hàng');
            return false;
          }
        })
      );
  }
  updateOrder(order: OrderDto) {
    return this.requestService
      .put(
        `${environment.baseUrl}/api/user/order/update`,
        order,
        'cập nhật đơn hàng'
      )
      .pipe(
        map((res: any) => {
          if (res.code === '000') {
            this.commonService.success('Cập nhật đơn hàng thành công');
            return res.data;
          } else {
            this.commonService.error('Lỗi cập nhật đơn hàng');
            return false;
          }
        })
      );
  }
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
  updateOrderStatus(
    id: number,
    newStatus: number,
    cancelNote: string,
    cusId: number
  ) {
    let data: UpdateStatus = {
      orderId: id,
      newStatus,
      note: cancelNote,
      userId: cusId,
    };
    return this.requestService
      .put(
        `${environment.baseUrl}/api/user/order/updateOrderStatus`,
        data,
        'cập nhật trạng thái đơn hàng'
      )
      .pipe(
        map((res: any) => {
          if (res.code === '000') {
            this.commonService.success(
              'Cập nhật trạng thái đơn hàng thành công'
            );
            return true;
          } else {
            this.commonService.error('Lỗi lấy đơn hàng');
            return false;
          }
        })
      );
  }
}
