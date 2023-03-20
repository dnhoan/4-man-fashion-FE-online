import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { cartItemsStore } from '../cart/cart.repository';
import { CartService } from '../cart/cart.service';
import { CommonService } from '../common-services/common.service';
import { customerStore } from '../dashboard/customer.repository';
import { Color } from '../model/color.model';
import { CustomerDto } from '../model/CustomerDto.model';
import { ProductDTO } from '../model/product.model';
import { ProductDetailDTO } from '../model/productDetail.model';
import { Size } from '../model/size.model';
import { upsertEntitiesById } from '@ngneat/elf-entities';
import { ProductDetailService } from './product-detail.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit {
  product!: ProductDTO;
  amount: number = 1;
  activeImage = 0;
  sizeSelected!: Size;
  colorSelected!: Color;
  productDetail!: ProductDetailDTO;
  currentCustomer!: CustomerDto | null;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productDetailService: ProductDetailService,
    private cartService: CartService,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    const product_id = this.route.snapshot.paramMap.get('id') as string;
    if (product_id) {
      this.productDetailService.getProductById(product_id).subscribe((res) => {
        if (res) {
          this.product = res;
          this.productDetail = this.product.productDetails[0];
          this.colorSelected = this.productDetail.color!;
          this.sizeSelected = this.productDetail.size!;
          console.log(this.productDetail);
        } else this.redirect404();
      });
    } else this.redirect404();
  }
  selectedColor(color: Color) {
    this.colorSelected = color;
    this.selectProductDetail();
  }
  selectedSize(size: Size) {
    this.sizeSelected = size;
    this.selectProductDetail();
  }
  addToCart() {
    let customer = customerStore.getValue().customer;
    if (customer) {
      let cart = {
        id: 0,
        amount: this.amount,
        productDetailCartDto: this.productDetail,
      };
      this.cartService.addToCart(customer.id, cart).subscribe((res) => {
        cartItemsStore.update(
          upsertEntitiesById(res.id, {
            updater: { amount: res.amount },
            creator: () => res,
          })
        );
        this.commonService.success('Thêm vào giỏ hàng thành công');
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  selectProductDetail() {
    if (this.sizeSelected && this.colorSelected)
      this.productDetail = this.product.productDetails.filter(
        (p) =>
          (this.colorSelected ? this.colorSelected.id == p.color!.id : true) &&
          (this.sizeSelected ? this.sizeSelected.id == p.size!.id : true)
      )[0];
  }

  redirect404() {
    this.commonService.error('Lỗi lấy thông tin sản phẩm chi tiết');
  }
}
