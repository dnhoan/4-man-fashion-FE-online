import { Component, OnInit } from '@angular/core';
import { ProductDTO } from '../model/product.model';
import { SearchOption } from '../model/search-option.model';
import { ProductsService } from './products.service';
import { SearchProduct } from '../model/search-product.model';
import { CommonConstants } from '../constants/common-constants';
import {
  BehaviorSubject,
  Subscription,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from 'rxjs';
import { PropertiesService } from './properties.service';
import { Category } from '../model/category.model';
import { Material } from '../model/material.model';
import { Models } from '../model/model.model';
import { Color } from '../model/color.model';
import { Size } from '../model/size.model';
import { Page } from '../model/pageable.model';
import { CommonService } from '../common-services/common.service';
import { SORT_PRODUCT } from '../constants/constant.constant';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { FavoriteProduct } from '../model/favoriteProduct.model';
import { customerStore } from '../dashboard/customer.repository';
import { FavoriteProductService } from '../service/favorite.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
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
  minPrice: number = 0;
  maxPrice: number = 999999999;
  page!: Page;
  categories: Category[] = [];
  materials: Material[] = [];
  models: Models[] = [];
  colors: Color[] = [];
  sizes: Size[] = [];
  searchProperty: SearchOption = {
    searchTerm: '',
    status: 1,
    offset: 0,
    limit: 1000,
  };
  searchChange$ = new BehaviorSubject<SearchProduct>(this.searchProduct);
  subSearchProduct!: Subscription;
  subQuery!: Subscription;

  constructor(
    private productsService: ProductsService,
    private propertiesService: PropertiesService,
    public commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router,
    private favoriteProductsService: FavoriteProductService
  ) {}

  ngOnInit(): void {
    this.subQuery = this.route.queryParams.subscribe((queryParams) => {
      this.searchProduct.name = queryParams['query'];
      this.searchChange$.next({ ...this.searchProduct, isLoading: true });
    });
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
    this.getProperties();
  }
  search(value: any) {
    this.searchProduct.name = value;
    this.searchProduct.offset = 0;
    this.searchChange$.next({ ...this.searchProduct, isLoading: true });
  }
  filter() {
    this.searchProduct.offset = 0;
    this.searchChange$.next({ ...this.searchProduct, isLoading: true });
  }
  onChangeColor() {
    this.searchProduct.colors = this.colors
      .filter((c) => c.isSelected)
      .map((c) => c.id as number);
    this.searchChange$.next({ ...this.searchProduct, isLoading: true });
  }
  onChangeSize() {
    this.searchProduct.sizes = this.sizes
      .filter((c) => c.isSelected)
      .map((c) => c.id as number);
    this.searchChange$.next({ ...this.searchProduct, isLoading: true });
  }
  onChangeCategory() {
    this.searchProduct.categories = this.categories
      .filter((c) => c.isSelected)
      .map((c) => c.id as number);
    this.searchChange$.next({ ...this.searchProduct, isLoading: true });
  }
  onChangeModel() {
    this.searchProduct.models = this.models
      .filter((c) => c.isSelected)
      .map((c) => c.id as number);
    this.searchChange$.next({ ...this.searchProduct, isLoading: true });
  }
  onChangeMaterial() {
    this.searchProduct.materials = this.materials
      .filter((c) => c.isSelected)
      .map((c) => c.id as number);
    this.searchChange$.next({ ...this.searchProduct, isLoading: true });
  }
  onChangePrice() {
    this.searchChange$.next({ ...this.searchProduct, isLoading: true });
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
  getProperties() {
    this.propertiesService.getPrices().subscribe((r) => {
      if (r) {
        this.minPrice = r[0];
        this.maxPrice = r[1];
        this.searchProduct.price = [this.minPrice, this.maxPrice];
      }
    });
    this.propertiesService
      .getAllCategory(this.searchProperty)
      .subscribe((res) => {
        if (res) {
          this.categories = res.items;
        }
      });
    this.propertiesService
      .getAllMaterial(this.searchProperty)
      .subscribe((res) => {
        if (res) {
          this.materials = res.items;
        }
      });
    this.propertiesService.getAllModel(this.searchProperty).subscribe((res) => {
      if (res) {
        this.models = res.items;
      }
    });
    this.propertiesService.getAllSize(this.searchProperty).subscribe((res) => {
      if (res) {
        this.sizes = res.items;
      }
    });
    this.propertiesService.getAllColor(this.searchProperty).subscribe((res) => {
      if (res) {
        this.colors = res.items;
      }
    });
  }
  ngOnDestroy() {
    this.subSearchProduct.unsubscribe();
    this.subQuery.unsubscribe();
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
