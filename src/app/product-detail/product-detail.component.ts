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
import { ProductDetail, ProductDetailDTO } from '../model/productDetail.model';
import { Size } from '../model/size.model';
import { upsertEntitiesById } from '@ngneat/elf-entities';
import { ProductDetailService } from './product-detail.service';
import { CartItemDto } from '../model/cartItemDto.model';

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
          console.log(this.product);

          if (this.product.productDetails.length == 1) {
            this.product.stock = this.product.productDetails[0].stock;
            this.product.productDetailSelected = this.product.productDetails[0];
            console.log(this.product);
          } else {
            this.product.stock = this.product.productDetails.reduce(
              (a, b) => a + b.stock,
              0
            );
            this.product.minPrice = Math.min(
              ...this.product.productDetails.map((item) => item.price as number)
            );
            this.product.maxPrice = Math.max(
              ...this.product.productDetails.map((item) => item.price as number)
            );
          }
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
    if (this.isProductDetailSelected()) {
      if (this.product.stock == 0) {
        this.commonService.info(
          'Sản phẩm này tạm hết hàng, vui lòng lựa chọn sản phẩm khác'
        );
        return;
      }
      let customer = customerStore.getValue().customer;
      if (customer) {
        let cart: CartItemDto = {
          id: 0,
          amount: this.amount,
          productDetailDTO: this.product
            .productDetailSelected as ProductDetailDTO,
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
  }
  addToFavorite() {}
  selectProductDetail() {
    if (this.isProductDetailSelected()) {
      let productDetail = this.product.productDetails.filter((proDetail) => {
        let result = true;
        if (this.product.sizes && this.product.sizes.length >= 1) {
          result = result && proDetail.size?.id == this.sizeSelected?.id;
        }
        if (this.product.colors && this.product.colors.length >= 1) {
          result = result && proDetail.color?.id == this.colorSelected?.id;
        }
        return result;
      });
      this.product.stock = productDetail[0].stock;
      this.amount = productDetail[0].stock == 0 ? 0 : 1;
      this.product.productDetailSelected = productDetail[0];
    }
  }
  isProductDetailSelected() {
    return !(
      ((this.product.sizes && this.product.sizes.length >= 1) ||
        (this.product.colors && this.product.colors.length >= 1)) &&
      ((this.product.sizes && this.product.sizes.length > 0
        ? this.sizeSelected == null
        : false) ||
        (this.product.colors && this.product.colors.length > 0
          ? this.colorSelected == null
          : false))
    );
  }

  redirect404() {
    this.commonService.error('Lỗi lấy thông tin sản phẩm chi tiết');
  }
}
