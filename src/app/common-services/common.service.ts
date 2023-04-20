import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import {
  ORDER_DETAIL_STATUS,
  ORDER_STATUS,
} from '../constants/constant.constant';
import { OrderDetailStatus, OrderStatus } from '../model/orderStatus.model';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor() {}

  error(text: string) {
    Swal.fire({
      title: 'Lỗi!',
      text,
      icon: 'error',
      confirmButtonText: 'Đóng',
    });
  }
  info(text: string) {
    Swal.fire({
      title: 'Thông báo!',
      text,
      icon: 'info',
      confirmButtonText: 'Đóng',
    });
  }
  success(text: string) {
    Swal.fire({
      position: 'top-end',
      title: 'Thành công',
      text,
      icon: 'success',
      showConfirmButton: false,
      timer: 1500,
    });
  }
  confirm(title: string) {
    return Swal.fire({
      title,
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      denyButtonText: `Không`,
    });
  }
  orderStatuses: OrderStatus[] = [
    {
      status: ORDER_STATUS.PENDING,
      code: 'PENDING',
      statusName: 'Chưa xác nhận',
      color: '#9898a0',
      icon: 'loading',
    },
    {
      status: ORDER_STATUS.CONFIRMED,
      code: 'CONFIRMED',
      statusName: 'Xác nhận',
      color: '#0099ff',
      icon: 'check',
    },
    {
      status: ORDER_STATUS.PACKAGING,
      code: 'PACKAGING',
      statusName: 'Đóng gói',
      color: '#cccc00',
      icon: 'dropbox',
    },
    {
      status: ORDER_STATUS.DELIVERING,
      code: 'DELIVERING',
      statusName: 'Đang vận chuyển',
      color: '#9966ff ',
      icon: 'car',
    },
    {
      status: ORDER_STATUS.COMPLETE,
      code: 'COMPLETE',
      statusName: 'Hoàn thành',
      color: '#009933',
      icon: 'check-circle',
    },
    {
      status: ORDER_STATUS.EXCHANGE,
      code: 'EXCHANGE',
      statusName: 'Đổi trả',
      color: '#003366',
      icon: 'sync',
    },
    {
      status: ORDER_STATUS.CANCEL_ORDER,
      code: 'CANCEL_ORDER',
      statusName: 'Hủy',
      color: '#ff3300',
      icon: 'stop',
    },
  ];
  orderDetailStatuses: OrderDetailStatus[] = [
    {
      status: ORDER_DETAIL_STATUS.EXCHANGE,
      title: 'Đổi trả',
      color: '#003366',
    },
    {
      status: ORDER_DETAIL_STATUS.RETURN,
      title: 'Trả hàng hoàn tiền',
      color: '#9966ff',
    },
    {
      status: ORDER_DETAIL_STATUS.REJECT_RETURN,
      title: 'Đã hủy trả hàng',
      color: '#ff3300',
    },
    {
      status: ORDER_DETAIL_STATUS.REJECT_EXCHANGE,
      title: 'Đã hủy đổi hàng',
      color: '#ff3300',
    },
    {
      status: ORDER_DETAIL_STATUS.RETURN_PENDING,
      title: 'Chờ xác nhận trả hàng',
      color: '#1890ff',
    },
    {
      status: ORDER_DETAIL_STATUS.EXCHANGE_PENDING,
      title: 'Chờ xác nhận đổi hàng',
      color: '#1890ff',
    },
  ];
}
