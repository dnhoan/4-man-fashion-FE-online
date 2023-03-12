import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { RequestService } from '../common-services/request.service';

@Injectable({
  providedIn: 'root',
})
export class ProductDetailService {
  apiProduct = `${environment.baseUrl}/api/admin`;
  constructor(private requestService: RequestService) {}

  getProductById(id: string) {
    return this.requestService
      .get(
        `${this.apiProduct}/product/getById/${id}`,
        'lấy thông tin sản phẩm chi tiết'
      )
      .pipe(
        map((res) => {
          if (res.code == '000') {
            return res.data;
          } else {
            Swal.fire({
              title: 'Error!',
              text: 'Lỗi lấy thông tin sản phẩm chi tiết',
              icon: 'error',
              confirmButtonText: 'Đóng',
            });
            return false;
          }
        })
      );
  }
}
