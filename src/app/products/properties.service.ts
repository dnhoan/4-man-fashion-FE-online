import { Injectable } from '@angular/core';
import { SearchOption } from '../model/search-option.model';
import { environment } from 'src/environments/environment';
import { RequestService } from '../common-services/request.service';
import { map } from 'rxjs';
import { CommonService } from '../common-services/common.service';

@Injectable({
  providedIn: 'root',
})
export class PropertiesService {
  apiProduct = `${environment.baseUrl}/api/user`;
  constructor(
    private requestService: RequestService,
    private commonService: CommonService
  ) {}

  getPrices() {
    return this.requestService
      .get(`${this.apiProduct}/getMinMaxPrice`, 'get price')
      .pipe(
        map((res) => {
          if (res.code == '000') {
            return res.data;
          } else {
            this.commonService.error('Lỗi lấy giá');
            return false;
          }
        })
      );
  }
  getAllCategory(search: SearchOption) {
    return this.requestService
      .get(
        `${this.apiProduct}/categories?offset=${search.offset}&limit=${search.limit}&status=${search.status}&search=${search.searchTerm}`,
        'lấy danh sách loại sản phẩm'
      )
      .pipe(
        map((res) => {
          if (res.code == '000') {
            return res.data;
          } else {
            this.commonService.error('Lỗi lấy danh sách loại sản phẩm');
            return false;
          }
        })
      );
  }
  getAllMaterial(search: SearchOption) {
    return this.requestService
      .get(
        `${this.apiProduct}/materials?offset=${search.offset}&limit=${search.limit}&status=${search.status}&search=${search.searchTerm}`,
        'lấy danh sách chất liệu'
      )
      .pipe(
        map((res) => {
          if (res.code == '000') {
            return res.data;
          } else {
            this.commonService.error('Lỗi lấy danh sách chất liệu');
            return false;
          }
        })
      );
  }
  getAllModel(search: SearchOption) {
    return this.requestService
      .get(
        `${this.apiProduct}/models?offset=${search.offset}&limit=${search.limit}&status=${search.status}&search=${search.searchTerm}`,
        'lấy danh sách kiểu dáng'
      )
      .pipe(
        map((res) => {
          if (res.code == '000') {
            return res.data;
          } else {
            this.commonService.error('Lỗi lấy danh sách kiểu dáng');
            return false;
          }
        })
      );
  }
  getAllSize(search: SearchOption) {
    return this.requestService
      .get(
        `${this.apiProduct}/sizes?offset=${search.offset}&limit=${search.limit}&status=${search.status}&search=${search.searchTerm}`,
        'lấy danh sách kích thước'
      )
      .pipe(
        map((res) => {
          if (res.code == '000') {
            return res.data;
          } else {
            this.commonService.error('Lỗi lấy danh sách kích thước');
            return false;
          }
        })
      );
  }
  getAllColor(search: SearchOption) {
    return this.requestService
      .get(
        `${this.apiProduct}/colors?offset=${search.offset}&limit=${search.limit}&status=${search.status}&search=${search.searchTerm}`,
        'lấy danh sách màu sắc'
      )
      .pipe(
        map((res) => {
          if (res.code == '000') {
            return res.data;
          } else {
            this.commonService.error('Lỗi lấy danh sách màu sắc');
            return false;
          }
        })
      );
  }
}
