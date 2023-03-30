import { CustomerDto } from './CustomerDto.model';
import { LogOrderStatus } from './logOrderStatus.model';
import { OrderDetail } from './orderDetail.model';

export interface OrderDto {
  id?: number;
  customer?: CustomerDto;
  customerId?: number;
  orderId?: string;
  orderStatus?: number;
  recipientName: string;
  recipientPhone: string;
  recipientEmail: string;
  address: string;
  shipFee?: number;
  goodsValue?: number;
  checkout?: number;
  sale?: number;
  totalMoney?: number;
  delivery?: number;
  purchaseType?: number;
  note?: string;
  cancelNote?: string;
  ctime?: string;
  mtime?: string;
  logsOrderStatus?: LogOrderStatus[];
  orderDetails?: OrderDetail[];
}
