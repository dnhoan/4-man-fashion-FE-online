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
import Swal from 'sweetalert2';
import { CommonService } from '../common-services/common.service';
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
  searchProduct: SearchOption = {
    searchTerm: '',
    status: 1,
    offset: 0,
    limit: 10,
  };
  constructor(
    private productsService: ProductsService,
    private favoriteProductsService: FavoriteProductService,
    private message: NzMessageService,
    private commonService: CommonService
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
  }
}
