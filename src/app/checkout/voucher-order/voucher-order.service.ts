import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { map } from 'rxjs';
import { CommonService } from 'src/app/common-services/common.service';
import { RequestService } from 'src/app/common-services/request.service';
import { CommonConstants } from 'src/app/constants/common-constants';
import { SearchOption } from 'src/app/model/search-option.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VoucherOrderService {
  public apiAdmin = `${environment.baseUrl}/api/admin`;
  constructor(
    private commonService: CommonService,
    private readonly requestService: RequestService
  ) {}
  getAllVoucher() {
    let search: SearchOption = {
      limit: 100,
      offset: 0,
      searchTerm: '',
      status: CommonConstants.STATUS.ACTIVE,
    };
    return this.requestService
      .get(
        `${this.apiAdmin}/voucher/getAll?offset=${search.offset}&limit=${search.limit}&status=${search.status}&search=${search.searchTerm}`,
        'lấy danh sách voucher'
      )
      .pipe(
        map((res) => {
          if ((res.code = '000')) {
            return res.data;
          } else {
            this.commonService.error('Lỗi lấy danh sách voucher');
            return false;
          }
        })
      );
  }
}
