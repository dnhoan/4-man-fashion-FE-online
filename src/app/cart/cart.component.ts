import { Component, OnInit } from '@angular/core';
import { deleteEntities, updateEntities } from '@ngneat/elf-entities';
import Swal from 'sweetalert2';
import { CommonService } from '../common-services/common.service';
import { customerStore } from '../dashboard/customer.repository';
import { CartItemDto } from '../model/cartItemDto.model';
import { CustomerDto } from '../model/CustomerDto.model';
import { ProductDetailCartDto } from '../model/ProductDetailCartDto.model';
import { cartItemsStore } from './cart.repository';
import { CartService } from './cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  currentCus!: CustomerDto;
  cartItems: CartItemDto[] = [];
  idCart!: number;
  totalMoneyCart: number = 0;
  constructor(
    private cartService: CartService,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.currentCus = customerStore.getValue().customer as CustomerDto;
    this.cartService
      .getProductCartByCusId(this.currentCus.id)
      .subscribe((res) => {
        this.idCart = res.id;
        this.cartItems = res.cartItemDtos;
        this.totalMoneyCart = this.cartItems.reduce(
          (a, b) => a + (b.amount * b.productDetailCartDto.price! || 0),
          0
        );
      });
  }
  updateQuantity(e: any, cartItem: CartItemDto) {
    this.cartService
      .updateQuantityCart(this.idCart, cartItem)
      .subscribe((res) => {
        cartItemsStore.update(updateEntities(cartItem.id, res));
      });
  }
  removeCartItem(cartItemId: number, index: number) {
    this.commonService
      .confirm('Bạn có muốn xóa sản phẩm này khỏi giỏ hàng?')
      .then((result) => {
        if (result.isConfirmed) {
          this.cartService.deleteCartItemById(cartItemId).subscribe((res) => {
            if (res) {
              cartItemsStore.update(deleteEntities(cartItemId));
              this.cartItems.splice(index, 1);
              this.commonService.success(
                'Xóa sản phẩm khỏi giỏ hàng thành công'
              );
            }
          });
        }
      });
  }
}
