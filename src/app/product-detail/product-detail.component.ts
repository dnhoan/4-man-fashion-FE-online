import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Color } from '../model/color.model';
import { ProductDTO } from '../model/product.model';
import { ProductDetailDTO } from '../model/productDetail.model';
import { Size } from '../model/size.model';
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
  constructor(
    private route: ActivatedRoute,
    private productDetailService: ProductDetailService
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

  selectProductDetail() {
    if (this.sizeSelected && this.colorSelected)
      this.productDetail = this.product.productDetails.filter(
        (p) =>
          (this.colorSelected ? this.colorSelected.id == p.color!.id : true) &&
          (this.sizeSelected ? this.sizeSelected.id == p.size!.id : true)
      )[0];
  }

  redirect404() {
    Swal.fire({
      title: 'Error!',
      text: 'Lỗi lấy thông tin sản phẩm chi tiết',
      icon: 'error',
      confirmButtonText: 'Đóng',
    });
  }
}
