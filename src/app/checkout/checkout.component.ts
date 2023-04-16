import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  deleteAllEntities,
  getAllEntities,
  selectAllEntities,
  selectLast,
} from '@ngneat/elf-entities';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Subscription } from 'rxjs';
import {
  EmailOrPhoneNumber,
  EmailValidator,
  EmptyValidator,
  PhoneNumber,
} from 'src/validators/emailOrPhone.validator';
import { cartItemsStore } from '../cart/cart.repository';
import { CartService } from '../cart/cart.service';
import { CommonService } from '../common-services/common.service';
import { CommonConstants } from '../constants/common-constants';
import { ORDER_STATUS, VOUCHER_TYPE } from '../constants/constant.constant';
import { customerStore } from '../dashboard/customer.repository';
import { OrdersService } from '../dashboard/orders/orders.service';
import { Address } from '../model/address.model';
import { CartItemDto } from '../model/cartItemDto.model';
import { CustomerDto } from '../model/CustomerDto.model';
import { OrderDto } from '../model/orderDto.model';
import { AddressesComponent } from './addresses/addresses.component';
import { AddressesService } from './addresses/addresses.service';
import { CheckoutService } from './checkout.service';
import { Voucher } from './voucher-order/voucher.model';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  formCheckout!: FormGroup;
  currentCustomer!: CustomerDto;
  addresses: Address[] = [];
  cartItems: CartItemDto[] = [];
  totalMoneyCart = 0;
  shipFee: number = 0;
  sale: number = 0;
  subItemCart!: Subscription;
  isCreateOrderSuccess = false;
  order!: OrderDto;
  voucher!: Voucher;
  constructor(
    private formBuilder: FormBuilder,
    private addressesService: AddressesService,
    private cartService: CartService,
    private modal: NzModalService,
    private viewContainerRef: ViewContainerRef,
    private commonService: CommonService,
    private orderService: OrdersService,
    private checkoutService: CheckoutService
  ) {}

  ngOnInit() {
    this.currentCustomer = customerStore.getValue().customer!;
    this.subItemCart = cartItemsStore
      .pipe(selectAllEntities())
      .subscribe((res) => {
        this.cartItems = res;
        this.totalMoneyCart = this.cartItems.reduce(
          (a, b) => a + (b.amount * b.productDetailDTO.price || 0),
          0
        );
      });

    this.addressesService
      .getAddressByCustomerId(this.currentCustomer.id)
      .subscribe((res) => {
        this.addresses = res;
      });
    this.formCheckout = this.formBuilder.group({
      recipientName: ['', Validators.compose([EmptyValidator()])],
      recipientPhone: ['', Validators.compose([PhoneNumber()])],
      recipientEmail: ['', Validators.compose([EmailValidator()])],
      note: '',
      address: [null, Validators.required],
    });
  }
  addAddress() {
    const modal = this.modal.create({
      nzTitle: 'Thêm địa chỉ',
      nzContent: AddressesComponent,
      nzViewContainerRef: this.viewContainerRef,
      nzFooter: null,
    });
    modal.afterClose.subscribe((result) => {
      if (result) {
        this.commonService.success('Thêm địa chỉ thành công');
        this.addresses.unshift(result);
      }
    });
  }
  changeAddress() {
    let address = this.formCheckout.get('address')!.value;
    this.getShipFee(
      address.province,
      address.district,
      address.detail + ', ' + address.ward
    );
  }
  getShipFee(province: string, district: string, address: string) {
    this.checkoutService
      .getFeeShip(province, district, address)
      .subscribe((res) => {
        if (res) {
          this.shipFee = res;
        }
      });
  }
  editAddress() {
    let addressEdited = this.formCheckout.get('address')?.value;
    if (addressEdited) {
      const modal = this.modal.create({
        nzTitle: 'Sửa địa chỉ',
        nzContent: AddressesComponent,
        nzViewContainerRef: this.viewContainerRef,
        nzComponentParams: {
          addressEdited,
        },
        nzFooter: null,
      });
      modal.afterClose.subscribe((result) => {
        if (result) {
          let i = this.addresses.findIndex((a) => a.id == addressEdited.id);
          this.commonService.success('Cập nhật địa chỉ thành công');
          this.addresses[i] = result;
          this.formCheckout.patchValue({
            address: result,
          });
        }
      });
    } else this.commonService.info('Vui lòng chọn địa chỉ');
  }
  removeAddress(address: Address, i: number) {
    let addressSelected = this.formCheckout.get('address')!.value;
    this.commonService
      .confirm('Bạn có muốn xóa địa chỉ này không?')
      .then((res) => {
        if (res.isConfirmed) {
          this.addressesService
            .deleteAddressById(address.id!)
            .subscribe((res) => {
              if (res) {
                if (addressSelected.id == address.id) {
                  this.shipFee = 0;
                  this.formCheckout.patchValue({
                    address: null,
                  });
                }
                this.addresses.splice(i, 1);
                this.commonService.success('Xóa địa chỉ thành công');
              }
            });
        }
      });
  }
  updateVoucher() {}
  checkout() {
    if (this.formCheckout.valid && this.cartItems.length) {
      let value = this.formCheckout.value;
      let data: OrderDto = {
        ...value,
        address: `${value.address.detail}, ${value.address.ward}, ${value.address.district}, ${value.address.province}`,
        id: 0,
        customer: this.currentCustomer,
        customerId: this.currentCustomer.id,
        orderStatus: ORDER_STATUS.PENDING,
        shipFee: this.shipFee,
        goodsValue: this.totalMoneyCart,
        checkout: 0,
        sale: this.sale,
        totalMoney: this.totalMoneyCart + this.shipFee - this.sale,
        delivery: CommonConstants.DELIVER_STATUS.DELIVER,
        purchaseType: CommonConstants.PURCHASE_TYPE.ONLINE,
        orderDetails: this.cartItems.map((item) => ({
          price: item.productDetailDTO?.price,
          quantity: item.amount,
          productDetail: item.productDetailDTO,
        })),
        logsOrderStatus: [
          {
            id: 0,
            user_change: 'Tạo đơn hàng',
            note: '',
            currentStatus: ORDER_STATUS.PENDING,
            newStatus: ORDER_STATUS.PENDING,
          },
        ],
        voucher: this.voucher,
      };
      this.orderService.createOrder(data).subscribe((res) => {
        if (res) {
          this.commonService.success('Tạo đơn hàng thành công');
          this.order = res;
          cartItemsStore.update(deleteAllEntities());
          this.isCreateOrderSuccess = true;
        }
      });
    }
  }
  onSelectVoucher(e: any) {
    console.log(e);

    this.voucher = e;
    if (e)
      this.sale =
        this.voucher!.voucherType == VOUCHER_TYPE.PERCENT
          ? (this.totalMoneyCart * this.voucher!.discount!) / 100
          : this.voucher!.discount!;
    else {
      this.sale = 0;
    }
  }
  returnHome() {}
  returnOrders() {}
  ngOnDestroy() {
    this.subItemCart.unsubscribe();
  }
}
