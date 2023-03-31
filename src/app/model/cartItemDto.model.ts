import { ProductDetail, ProductDetailDTO } from './productDetail.model';

export interface CartItemDto {
  id: number;
  amount: number;
  productDetailDTO: ProductDetailDTO;
}
