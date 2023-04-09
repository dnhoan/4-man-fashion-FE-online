import { OrderDetail } from './orderDetail.model';

export interface ExchangeShopRequestBody {
  orderDetails: OrderDetail;
  currentOrderDetailId: number;
  orderId: number;
  statusOrder: number;
}
