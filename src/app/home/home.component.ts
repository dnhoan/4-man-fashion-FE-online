import { Component, OnInit } from '@angular/core';
import { ProductDTO } from '../model/product.model';
import { SearchOption } from '../model/search-option.model';
import { ProductsService } from '../products/products.service';
import { FavoriteProduct } from '../model/favoriteProduct.model';
import { CustomerDto } from '../model/CustomerDto.model';
import { Subscription } from 'rxjs';
import { FavoriteProductService } from '../service/favorite.service';
import { customerStore } from '../dashboard/customer.repository';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  customer!: CustomerDto;
  subCustomer!: Subscription;
  favoriteProduct!: FavoriteProduct;
  currentProduct!: number;
  product!: ProductDTO;
  products: ProductDTO[] = [];
  searchProduct: SearchOption = {
    searchTerm: '',
    status: 1,
    offset: 0,
    limit: 10,
  };
  constructor(
    private productsService: ProductsService,
    private favoriteProductsService: FavoriteProductService,
    private message: NzMessageService
  ) {}
  //Slider settings
  slideConfig = { slidesToShow: 1, slidesToScroll: 1 };
  ngOnInit(): void {
    this.productsService.getAllProduct(this.searchProduct).subscribe((res) => {
      this.products = res.items;
    });

    this.subCustomer = customerStore.subscribe((res: any) => {
      if (res.customer) {
        this.customer = res.customer as CustomerDto;
      }
    });
  }

  addFavoriteProduct(product: ProductDTO) {
    let data: FavoriteProduct = {
      id: 0,
      customer: this.customer,
      product: product,
    };
    this.favoriteProductsService
      .createFavoriteProduct(data)
      .subscribe((res) => {
        if (res.code == '000') {
          this.favoriteProduct = res.items;
          this.message.success(
            'Sản phẩm đã được thêm vào danh sách yêu thích!'
          );
        }
        if (res.code == '409') {
          this.message.error(
            'Sản phẩm này đã có trong danh sách sản phẩm yêu thích của bạn!'
          );
        }
      });
  }
}
