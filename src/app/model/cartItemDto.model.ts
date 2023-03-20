import { ProductDetail } from './productDetail.model';

export interface CartItemDto {
  id: number;
  amount: number;
  productDetailCartDto: ProductDetail;
}
