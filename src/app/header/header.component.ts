import { Component, OnInit } from '@angular/core';
import { select } from '@ngneat/elf';
import { deleteEntities, upsertEntities } from '@ngneat/elf-entities';
import { addEntities, selectAllEntities } from '@ngneat/elf-entities';
import { Subscription } from 'rxjs';
import { cartItemsStore } from '../cart/cart.repository';
import { CartService } from '../cart/cart.service';
import { CommonService } from '../common-services/common.service';
import { JwtService } from '../common-services/jwt.service';
import { customerStore } from '../dashboard/customer.repository';
import { CartItemDto } from '../model/cartItemDto.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  menuItemAccount: {
    routerLink: string;
    label: string;
  }[] = [];
  cartItems: CartItemDto[] = [];
  totalMoneyCart: number = 0;
  subCustomerInfo!: Subscription;
  subItemCart!: Subscription;
  constructor(
    public jwtService: JwtService,
    private cartService: CartService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.subCustomerInfo = customerStore
      .pipe(select((state) => state.customer))
      .subscribe((cus) => {
        console.log(cus);

        if (cus) {
          this.menuItemAccount = [
            { routerLink: 'dashboard', label: 'Thông tin cá nhân' },
            { routerLink: 'dashboard/order', label: 'Đơn hàng' },
            { routerLink: 'dashboard/address', label: 'Địa chỉ' },
          ];
          this.cartService.getProductCartByCusId(cus.id).subscribe((res) => {
            cartItemsStore.update(upsertEntities(res.cartItemDtos));
          });
        } else
          this.menuItemAccount = [
            { routerLink: 'login', label: 'Đăng nhập' },
            { routerLink: 'signup', label: 'Đăng ký' },
          ];
      });
    this.subItemCart = cartItemsStore
      .pipe(selectAllEntities())
      .subscribe((res) => {
        this.cartItems = res;
        this.totalMoneyCart = this.cartItems.reduce(
          (a, b) => a + (b.amount * b.productDetailDTO.price || 0),
          0
        );
      });
  }
  removeCart(cartItemId: number) {
    this.commonService
      .confirm('Bạn có muốn xóa sản phẩm này khỏi giỏ hàng?')
      .then((result) => {
        if (result.isConfirmed) {
          this.cartService.deleteCartItemById(cartItemId).subscribe((res) => {
            if (res) {
              cartItemsStore.update(deleteEntities(cartItemId));
              this.commonService.success(
                'Xóa sản phẩm khỏi giỏ hàng thành công'
              );
            }
          });
        }
      });
  }
  ngOnDestroy() {
    this.subCustomerInfo.unsubscribe();
    this.subItemCart.unsubscribe();
  }
}
