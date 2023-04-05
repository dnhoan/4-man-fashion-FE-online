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

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  orderStatuses: OrderStatus[] = [];
  ORDER_STATUS = ORDER_STATUS;
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
    private commonService: CommonService,
    private ordersService: OrdersService,
    private modal: NzModalService,
    private viewContainerRef: ViewContainerRef,
    private orderService: OrdersService
  ) {}

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
  onChangeTab(e: any) {
    this.isLoadingOrder = true;
    this.orders = [];
    let status = this.orderStatuses[e.index].status;
    this.searchChange$.next({ ...this.searchOrder, status });
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
        this.tabIndexSelected = 5;
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
