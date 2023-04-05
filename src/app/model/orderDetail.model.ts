import { Exchange } from './exchange.model';
import { ProductDetailDTO } from './productDetail.model';

export interface OrderDetail {
  id?: number;
  price: number;
  quantity: number;
  productDetail: ProductDetailDTO;
  exchangeId?: number;
  statusExchange?: number;
  statusOrderDetail?: number;
  exchange?: Exchange;
}
