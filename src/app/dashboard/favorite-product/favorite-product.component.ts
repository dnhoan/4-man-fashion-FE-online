import { Component, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  Subscription,
  debounceTime,
  distinctUntilChanged,
  skip,
  switchMap,
} from 'rxjs';
import { CustomerDto } from 'src/app/model/CustomerDto.model';
import { FavoriteProductService } from 'src/app/service/favorite.service';
import { customerStore } from '../customer.repository';
import { SearchOption } from 'src/app/model/search-option.model';
import { Page } from 'src/app/model/pageable.model';
import { FavoriteProduct } from 'src/app/model/favoriteProduct.model';
import { ProductDTO } from 'src/app/model/product.model';
import { ProductsService } from 'src/app/products/products.service';
import { OrderDetail } from 'src/app/model/orderDetail.model';
import { OrdersService } from '../orders/orders.service';
import { OrderDto } from 'src/app/model/orderDto.model';
import { CommonService } from 'src/app/common-services/common.service';
import { CartItemDto } from 'src/app/model/cartItemDto.model';
import { ProductDetailDTO } from 'src/app/model/productDetail.model';
import { CartService } from 'src/app/cart/cart.service';
import { cartItemsStore } from 'src/app/cart/cart.repository';
import { upsertEntitiesById } from '@ngneat/elf-entities';

@Component({
  selector: 'app-favorite-product',
  templateUrl: './favorite-product.component.html',
  styleUrls: ['./favorite-product.component.css'],
})
export class FavoriteProductComponent implements OnInit {
  customer!: CustomerDto;
  subCustomer!: Subscription;
  products: ProductDTO[] = [];
  subUpdateOrderDetail!: Subscription;
  updateOrderDetail$ = new BehaviorSubject<OrderDetail | null>(null);
  searchFavoriteProduct: SearchOption = {
    searchTerm: '',
    status: 1,
    offset: 0,
    limit: 10,
  };
  searchChange$ = new BehaviorSubject<SearchOption>(this.searchFavoriteProduct);
  subSearchProduct!: Subscription;
  page!: Page;
  subProducts!: Subscription;
  order!: OrderDto;
  constructor(
    private favoriteProductService: FavoriteProductService,
    private productsService: ProductsService,
    private orderService: OrdersService,
    private commonService: CommonService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.subCustomer = customerStore.subscribe((res: any) => {
      if (res.customer) {
        this.customer = res.customer as CustomerDto;
      }
    });
    this.getListFavoriteProduct();
  }
  addToCart(product: ProductDTO, index: number) {
    // let productDetail = product.productDetailSelected;
    if (product.stock == 0) {
      this.commonService.info(
        'Sản phẩm này tạm hết hàng, vui lòng lựa chọn sản phẩm khác'
      );
      return;
    }
    let customer = customerStore.getValue().customer;
    let cart: CartItemDto = {
      id: 0,
      amount: product.amount!,
      productDetailDTO: product.productDetailSelected as ProductDetailDTO,
    };
    this.cartService.addToCart(customer!.id, cart).subscribe((res) => {
      cartItemsStore.update(
        upsertEntitiesById(res.id, {
          updater: { amount: res.amount },
          creator: () => res,
        })
      );
      this.commonService.success('Thêm vào giỏ hàng thành công');
    });
  }
  getListFavoriteProduct() {
    this.favoriteProductService
      .getFavoriteProductByCustomerId(
        this.customer.id,
        this.searchFavoriteProduct
      )
      .subscribe((res) => {
        if (res.items)
          this.products = res.items.map((item: ProductDTO) => {
            if (item.productDetails.length == 1) {
              item.stock = item.productDetails[0].stock;
              item.productDetailSelected = item.productDetails[0];
            } else {
              item.stock = item.productDetails.reduce((a, b) => a + b.stock, 0);
            }
            return item;
          });
      });
  }

  ngOnDestroy() {
    this.subCustomer.unsubscribe();
  }

  onChangeOptions(product: ProductDTO, index: number) {
    if (
      !(
        ((product.sizes && product.sizes.length >= 1) ||
          (product.colors && product.colors.length >= 1)) &&
        ((product.sizes && product.sizes.length > 0
          ? product.sizeSelected == null
          : false) ||
          (product.colors && product.colors.length > 0
            ? product.colorSelected == null
            : false))
      )
    ) {
      let productDetail = product.productDetails.filter((proDetail) => {
        let result = true;
        if (product.sizes && product.sizes.length >= 1) {
          result = result && proDetail.size?.id == product.sizeSelected?.id;
        }
        if (product.colors && product.colors.length >= 1) {
          result = result && proDetail.color?.id == product.colorSelected?.id;
        }
        return result;
      });
      this.products[index].stock = productDetail[0].stock;
      this.products[index].amount = productDetail[0].stock == 0 ? 0 : 1;
      this.products[index].productDetailSelected = productDetail[0];
    }
  }
}
