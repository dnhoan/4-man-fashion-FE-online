import { Component, OnInit } from '@angular/core';
import { ProductDTO } from '../model/product.model';
import { SearchOption } from '../model/search-option.model';
import { ProductsService } from '../products/products.service';
import { FavoriteProduct } from '../model/favoriteProduct.model';
import { CustomerDto } from '../model/CustomerDto.model';
import {
  BehaviorSubject,
  Subscription,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from 'rxjs';
import { FavoriteProductService } from '../service/favorite.service';
import { customerStore } from '../dashboard/customer.repository';
import { NzMessageService } from 'ng-zorro-antd/message';
import Swal from 'sweetalert2';
import { CommonService } from '../common-services/common.service';
import { CommonConstants } from '../constants/common-constants';
import { SearchProduct } from '../model/search-product.model';
import { SORT_PRODUCT } from '../constants/constant.constant';
import { Page } from '../model/pageable.model';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  customer!: CustomerDto;
  subCustomer!: Subscription;
  currentProduct!: number;
  product!: ProductDTO;
  products: ProductDTO[] = [];
  searchProduct: SearchProduct = {
    status: CommonConstants.STATUS.ACTIVE,
    name: '',
    categories: [],
    materials: [],
    models: [],
    colors: [],
    sizes: [],
    price: [0, 999999999],
    offset: 0,
    limit: 9,
    isLoading: true,
    sort: SORT_PRODUCT.DEFAULT,
  };
  page!: Page;
  searchChange$ = new BehaviorSubject<SearchProduct>(this.searchProduct);
  subSearchProduct!: Subscription;
  constructor(
    private productsService: ProductsService,
    private favoriteProductsService: FavoriteProductService,
    private message: NzMessageService,
    private commonService: CommonService,
    private router: Router
  ) {}
  //Slider settings
  slideConfig = { slidesToShow: 1, slidesToScroll: 1 };
  ngOnInit(): void {
    this.subSearchProduct = this.searchChange$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((res: SearchProduct) => {
          return this.productsService.searchProduct(res);
        })
      )
      .subscribe((res: any) => {
        this.page = { ...res };
        this.products = res.items;
        this.searchProduct.isLoading = false;
      });

    this.subCustomer = customerStore.subscribe((res: any) => {
      if (res.customer) {
        this.customer = res.customer as CustomerDto;
      }
    });
  }
  onChangeStatus(status: any) {
    this.searchProduct.status = status;
    this.searchProduct.offset = 0;
    this.searchChange$.next({ ...this.searchProduct, isLoading: true });
  }
  onChangeSizePage(event: any) {
    this.searchProduct.limit = event;
    this.searchChange$.next({ ...this.searchProduct, isLoading: true });
  }
  onChangeIndexPage(event: any) {
    --event;
    this.searchProduct.offset = event;
    this.searchChange$.next({ ...this.searchProduct, isLoading: true });
  }
  addFavoriteProduct(product: ProductDTO) {
    let customer = customerStore.getValue().customer;
    if (customer) {
      let data: FavoriteProduct = {
        id: 0,
        customer: customer,
        product: product,
      };
      this.commonService
        .confirm('Bạn có muốn thêm sản phẩm này vào danh sách yêu thích?')
        .then((result) => {
          if (result.isConfirmed) {
            this.favoriteProductsService
              .createFavoriteProduct(data)
              .subscribe((res) => {
                if (res) {
                  this.commonService.success(
                    'Thêm sản phẩm vào danh sách yêu thích thành công'
                  );
                }
              });
          }
        });
    } else {
      this.router.navigate(['/login']);
    }
  }
}
