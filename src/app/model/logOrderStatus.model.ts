import { ProductDetail } from './productDetail.model';

export interface LogOrderStatus {
  id?: number;
  times?: Date;
  user_change: string;
  note?: string;
  currentStatus: number;
  newStatus: number;
  //  accounts:;
  productDetails?: ProductDetail[];
}
