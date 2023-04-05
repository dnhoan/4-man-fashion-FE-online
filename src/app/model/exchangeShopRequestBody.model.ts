import { OrderDetail } from './orderDetail.model';

export interface ExchangeShopRequestBody {
  orderDetails: OrderDetail;
  orderId: number;
  statusOrder: number;
}
