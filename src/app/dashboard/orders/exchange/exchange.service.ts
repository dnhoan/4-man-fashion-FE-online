import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { CommonService } from 'src/app/common-services/common.service';
import { RequestService } from 'src/app/common-services/request.service';
import { ExchangeShopRequestBody } from 'src/app/model/exchangeShopRequestBody.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ExchangeService {
  constructor(
    private requestService: RequestService,
    private commonService: CommonService
  ) {}

  returnOrderDetail(data: ExchangeShopRequestBody) {
    return this.requestService
      .post(
        `${environment.baseUrl}/api/user/order/return`,
        data,
        'hoàn trả đơn hàng'
      )
      .pipe(
        map((res) => {
          if (res.code == '000') {
            return true;
          }
          this.commonService.error('Lỗi hoàn trả đơn hàng');
          return false;
        })
      );
  }
}
