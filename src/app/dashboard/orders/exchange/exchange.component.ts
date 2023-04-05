import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { OrderDto } from 'src/app/model/orderDto.model';
import { FormExchangeComponent } from './form-exchange/form-exchange.component';
import { OrderDetail } from 'src/app/model/orderDetail.model';

@Component({
  selector: 'app-exchange',
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.scss'],
})
export class ExchangeComponent implements OnInit {
  @Input() order!: OrderDto;

  constructor(
    private modal: NzModalService,
    private viewContainerRef: ViewContainerRef,
    private modalRef: NzModalRef
  ) {}

  ngOnInit(): void {}
  showModalFormInputExchange(orderDetail: OrderDetail, isExchange: boolean) {
    const modal = this.modal.create({
      nzTitle: 'Thông tin đổi trả',
      nzContent: FormExchangeComponent,
      nzViewContainerRef: this.viewContainerRef,
      nzFooter: null,
      nzWidth: '50%',
      nzComponentParams: {
        orderDetail,
        isExchange,
        orderId: this.order.id,
        orderStatus: this.order.orderStatus,
      },
    });
    modal.afterClose.subscribe((result) => {
      if (result) {
        this.modalRef.destroy(true);
      }
    });
  }
}
