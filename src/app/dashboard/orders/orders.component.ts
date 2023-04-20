import { Component, OnInit, ViewContainerRef } from '@angular/core';
import {
  BehaviorSubject,
  Subscription,
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
} from 'rxjs';
import { CommonService } from 'src/app/common-services/common.service';
import { RequestService } from 'src/app/common-services/request.service';
import { OrderDto } from 'src/app/model/orderDto.model';
import { OrderStatus } from 'src/app/model/orderStatus.model';
import { SearchOption } from 'src/app/model/search-option.model';
import { environment } from 'src/environments/environment';
import { OrdersService } from './orders.service';
import { ORDER_STATUS } from 'src/app/constants/constant.constant';
import { customerStore } from '../customer.repository';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ExchangeComponent } from './exchange/exchange.component';
import { OrderDetail } from 'src/app/model/orderDetail.model';
import { FormExchangeComponent } from './exchange/form-exchange/form-exchange.component';
import { ORDER_DETAIL_STATUS } from 'src/app/constants/constant.constant';
import { CommonConstants } from 'src/app/constants/common-constants';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  orderStatuses: OrderStatus[] = [];
  ORDER_STATUS = ORDER_STATUS;
  ORDER_DETAIL_STATUS = ORDER_DETAIL_STATUS;
  orders: OrderDto[] = [];
  currentOrder!: OrderDto;
  tabIndexSelected = 0;
  searchOrder: SearchOption = {
    searchTerm: '',
    status: 1,
    offset: 0,
    limit: 10,
  };
  isShowConfirmCancelOrder = false;
  productDialog = false;
  isLoadingOrder = true;
  cancelNote = '';
  subSearchOrder!: Subscription;
  searchChange$ = new BehaviorSubject<SearchOption>(this.searchOrder);
  isShowStatusHistory = false;
  constructor(
    public commonService: CommonService,
    private ordersService: OrdersService,
    private modal: NzModalService,
    private viewContainerRef: ViewContainerRef,
    private orderService: OrdersService,
    private activateRoute: ActivatedRoute
  ) {
    this.activateRoute.queryParams.subscribe((params) => {
      console.log(params);
      if (params && params['tab-index']) {
        this.searchOrder.status = params['tab-index'];
        this.tabIndexSelected = params['tab-index'] - 1;
        console.log(this.searchOrder);
      }
    });
  }

  ngOnInit(): void {
    let customer = customerStore.getValue().customer;
    this.orderStatuses = this.commonService.orderStatuses;
    this.subSearchOrder = this.searchChange$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((res) => {
          return this.ordersService.getOrderByCustomerId(res, customer?.id!);
        })
      )
      .subscribe((res: any) => {
        // this.page = { ...res };
        this.orders = res.items;
        this.isLoadingOrder = false;
      });
  }
  showDetailExchange(orderDetail: OrderDetail) {
    const modal = this.modal.create({
      nzTitle: 'Lý do đổi trả',
      nzContent: FormExchangeComponent,
      nzViewContainerRef: this.viewContainerRef,
      nzFooter: null,
      nzWidth: '50%',
      nzComponentParams: {
        orderDetail,
        isView: true,
      },
    });
    modal.afterClose.subscribe((result) => {
      if (result) {
      }
    });
  }
  onChangeTab(e: any) {
    this.isLoadingOrder = true;
    this.orders = [];
    let status = this.orderStatuses[e.index].status;
    this.searchChange$.next({ ...this.searchOrder, status });
  }
  showModalFormInputExchange(
    orderDetail: OrderDetail,
    isExchange: boolean,
    orderId: number
  ) {
    const modal = this.modal.create({
      nzTitle: 'Thông tin đổi trả',
      nzContent: FormExchangeComponent,
      nzViewContainerRef: this.viewContainerRef,
      nzFooter: null,
      nzWidth: '50%',
      nzComponentParams: {
        orderDetail,
        isExchange,
        orderId,
        orderStatus: ORDER_STATUS.CANCEL_ORDER,
      },
    });
    modal.afterClose.subscribe((result) => {
      if (result) {
        this.tabIndexSelected = 5;
      }
    });
  }
  receivedOrder(orderId: number, i_order: number) {}
  exchangeOrder(order: OrderDto, i_order: number) {
    const modal = this.modal.create({
      nzTitle: 'Đổi trả',
      nzContent: ExchangeComponent,
      nzViewContainerRef: this.viewContainerRef,
      nzFooter: null,
      nzComponentParams: {
        order,
      },
      nzWidth: '50%',
    });
    modal.afterClose.subscribe((result) => {
      if (result) {
        console.log('result: ', result);

        this.tabIndexSelected = 5;
        this.searchChange$.next({
          ...this.searchOrder,
          status: ORDER_STATUS.EXCHANGE,
        });
      }
    });
  }

  i_order!: number;
  showConfirmCancelOrder(i_order: number) {
    this.isShowConfirmCancelOrder = true;
    this.i_order = i_order;
  }
  showOrderDetail(order: OrderDto) {
    this.currentOrder = order;
    this.productDialog = true;
  }
  hideDialog() {}
  closeConfirmCancelOrder() {
    this.isShowConfirmCancelOrder = false;
    this.cancelNote = '';
  }
  cancelOrder() {
    if (this.cancelNote.trim()) {
      this.orderService
        .updateOrderStatus(
          this.orders[this.i_order].id!,
          ORDER_STATUS.CANCEL_ORDER,
          this.cancelNote,
          customerStore.getValue().customer!.id
        )
        .subscribe((res) => {
          if (res) {
            this.isShowConfirmCancelOrder = false;
            this.cancelNote = '';
            this.orders.splice(this.i_order, 1);
          }
        });
    }
  }
  closeOrderDetail() {
    this.productDialog = false;
  }

  ngOnDestroy() {
    this.subSearchOrder.unsubscribe();
  }
}
