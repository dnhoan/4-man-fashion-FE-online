import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { VoucherOrderService } from './voucher-order.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Voucher } from './voucher.model';
import { VOUCHER_TYPE } from 'src/app/constants/constant.constant';
import { CommonService } from 'src/app/common-services/common.service';

@Component({
  selector: 'app-voucher-order',
  templateUrl: './voucher-order.component.html',
  styleUrls: ['./voucher-order.component.scss'],
})
export class VoucherOrderComponent implements OnInit {
  @Input() goodValue!: number;
  radioValue = 'A';
  vouchers: Voucher[] = [];
  @Output() onSelectVoucher = new EventEmitter<any>();
  voucher!: Voucher | undefined;
  voucherForm!: Voucher | null;
  VOUCHER_TYPE = VOUCHER_TYPE;
  isShowModalVoucher = false;
  voucherCode = '';
  constructor(
    private voucherOrderService: VoucherOrderService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.voucherOrderService.getAllVoucher().subscribe((res) => {
      this.vouchers = res.items.sort((a: any, b: any) => {
        return a.minimumInvoiceValue - b.minimumInvoiceValue;
      });
    });
  }
  removeVoucher() {
    this.onSelectVoucher.emit(null);
    this.voucher = undefined;
  }
  showModal() {
    if (this.voucher) {
      this.voucherForm = { ...this.voucher };
    }
    this.isShowModalVoucher = true;
  }
  applyVoucher() {
    let v = this.vouchers.filter((v) => v.voucherCode == this.voucherCode);
    if (v && v.length) {
      if (this.goodValue > v[0].minimumInvoiceValue!) {
        this.voucher = v[0];
        this.onSelectVoucher.emit(v[0]);
      } else
        this.commonService.info('Bạn chưa đủ điều kiện áp mã giảm giá này');
    } else {
      this.commonService.info('Mã giảm giá không tồn tại!');
    }
  }
  handleOk() {
    if (this.voucherForm) {
      this.voucher = { ...this.voucherForm };
      if (this.voucher) this.onSelectVoucher.emit(this.voucher);
    } else {
      this.voucher = undefined;
      this.onSelectVoucher.emit(null);
    }
    this.voucherForm = null;
    this.isShowModalVoucher = false;
  }
  handleCancel() {
    this.voucherForm = null;
    this.isShowModalVoucher = false;
  }
}
