import { Component, OnInit } from '@angular/core';
import { ProductDTO } from '../model/product.model';
import { SearchOption } from '../model/search-option.model';
import { ProductsService } from './products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  products: ProductDTO[] = [];
  searchProduct: SearchOption = {
    searchTerm: '',
    status: 1,
    offset: 0,
    limit: 10,
  };
  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this.productsService.getAllProduct(this.searchProduct).subscribe((res) => {
      this.products = res.items;
    });
  }
}
