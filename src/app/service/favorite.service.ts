import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { RequestService } from '../common-services/request.service';
import { FavoriteProduct } from '../model/favoriteProduct.model';
import { CommonService } from '../common-services/common.service';
import { SearchOption } from '../model/search-option.model';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
  providedIn: 'root',
})
export class FavoriteProductService {
  apiFavoriteProduct = `${environment.baseUrl}/api/user`;
  constructor(
    private requestService: RequestService,
    private commonService: CommonService,
    private message: NzMessageService
  ) {}

  getFavoriteProductByCustomerId(idCustomer: number, search: SearchOption) {
    return this.requestService
      .get(
        `${this.apiFavoriteProduct}/favorite/getList/${idCustomer}?offset=${search.offset}&limit=${search.limit}&status=${search.status}`,
        'lấy danh sách sản phẩm yêu thích'
      )
      .pipe(
        map((res) => {
          if (res.code == '000') {
            return res.data;
          } else {
            Swal.fire({
              title: 'Error!',
              text: 'Lỗi lấy danh sách sản phẩm yêu thích!',
              icon: 'error',
              confirmButtonText: 'Đóng',
            });
            return false;
          }
        })
      );
  }

  createFavoriteProduct(favoriteProduct: FavoriteProduct) {
    return this.requestService
      .post(
        `${this.apiFavoriteProduct}/favorite/create`,
        favoriteProduct,
        'Thêm sản phẩm yêu thích'
      )
      .pipe(
        map((res) => {
          if (res.code == '000') {
            return true;
          } else if (res.code == '409') {
            this.commonService.info(
              'Sản phẩm này đã có trong danh sách sản phẩm yêu thích của bạn!'
            );
            return false;
          } else {
            this.commonService.error('Lỗi thêm sản phẩm yêu thích');
            return false;
          }
        })
      );
  }
}
