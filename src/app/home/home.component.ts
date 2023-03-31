import { Component, OnInit } from '@angular/core';
import { ProductDTO } from '../model/product.model';
import { SearchOption } from '../model/search-option.model';
import { ProductsService } from '../products/products.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  products: ProductDTO[] = [];
  searchProduct: SearchOption = {
    searchTerm: '',
    status: 1,
    offset: 0,
    limit: 10,
  };
  constructor(
    private productsService: ProductsService
  ) {}
  //Slider settings
  slideConfig = { slidesToShow: 1, slidesToScroll: 1 };
  ngOnInit(): void {
    this.productsService.getAllProduct(this.searchProduct).subscribe((res) => {
      this.products = res.items;
    });
  }
}
