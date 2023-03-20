import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CommonService } from '../common-services/common.service';
import { RequestService } from '../common-services/request.service';
import { CartItemDto } from '../model/cartItemDto.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  apiProduct = `${environment.baseUrl}/api/user`;
  constructor(
    private requestService: RequestService,
    private commonService: CommonService
  ) {}

  getProductCartByCusId(id: any) {
    return this.requestService
      .get(`${this.apiProduct}/cart/${id}`, 'lấy thông tin giỏ hàng')
      .pipe(
        map((res) => {
          if (res.code == '000') {
            return res.data;
          } else {
            this.commonService.error('Lỗi lấy danh sách giỏ hàng');
            return false;
          }
        })
      );
  }
  deleteCartItemById(cartItemId: any) {
    return this.requestService
      .delete(
        `${this.apiProduct}/cartItem/${cartItemId}`,
        'xóa sản phẩm khỏi giỏ hàng'
      )
      .pipe(
        map((res) => {
          if (res.code == '000') {
            return true;
          } else {
            this.commonService.error('Lỗi xóa sản phẩm khỏi giỏ hàng');
            return false;
          }
        })
      );
  }
  updateQuantityCart(cart_id: any, cart: CartItemDto) {
    return this.requestService
      .put(`${this.apiProduct}/cartItem/${cart_id}`, cart, 'cập nhật giỏ hàng')
      .pipe(
        map((res) => {
          if (res.code == '000') {
            return res.data;
          } else {
            this.commonService.error('Lỗi lấy danh sách giỏ hàng');
            return false;
          }
        })
      );
  }
  addToCart(customerId: number, cart: CartItemDto) {
    return this.requestService
      .post(
        `${this.apiProduct}/cartItem/${customerId}`,
        cart,
        'thêm vào sản phẩm vào giỏ hàng'
      )
      .pipe(
        map((res) => {
          if (res.code == '000') {
            return res.data;
          } else {
            this.commonService.error('Lỗi thêm vào sản phẩm vào giỏ hàng');
            return false;
          }
        })
      );
  }
}
