import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { RequestService } from '../common-services/request.service';
import { SearchProduct } from '../model/search-product.model';
import { SearchOption } from '../model/search-option.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  apiProduct = `${environment.baseUrl}/api/user`;
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

  searchProduct(search: SearchProduct) {
    return this.requestService
      .post(
        `${this.apiProduct}/product/searchProduct`,
        search,
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
