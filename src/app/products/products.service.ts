import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { RequestService } from '../common-services/request.service';
import { SearchOption } from '../model/search-option.model';
import { ProductDTO } from '../model/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  apiProduct = `${environment.baseUrl}/api/admin`;
  constructor(private requestService: RequestService) {}

  getAllProduct(search: SearchOption) {
    return this.requestService
      .get(
        `${this.apiProduct}/product/getAll?offset=${search.offset}&limit=${search.limit}&status=${search.status}&search=${search.searchTerm}`,
        'lấy danh sách sản phẩm'
      )
      .pipe(
        map((res) => {
          if (res.code == '000') {
            return res.data;
          } else {
            Swal.fire({
              title: 'Error!',
              text: 'Lỗi lấy danh sách sản phẩm!',
              icon: 'error',
              confirmButtonText: 'Đóng',
            });
            return false;
          }
        })
      );
  }

  getListproduct(): Observable<any> {
    return this.requestService.get<any>(`${this.apiProduct}/product/getList`,
    'lấy danh sách sản phẩm');
  }


  getProductById(idProduct: number) {
    return this.requestService
      .get(
        `${this.apiProduct}/product/getById/${idProduct}`,
        'lấy sản phẩm theo ID'
      )
      .pipe(
        map((res) => {
          if (res.code == '000') {
            return res.data;
          } else {
            Swal.fire({
              title: 'Error!',
              text: 'Lỗi lấy sản phẩmtheo ID!',
              icon: 'error',
              confirmButtonText: 'Đóng',
            });
            return false;
          }
        })
      );
  }
}
