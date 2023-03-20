import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  getAllEntities,
  selectAllEntities,
  selectLast,
} from '@ngneat/elf-entities';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Subscription } from 'rxjs';
import { cartItemsStore } from '../cart/cart.repository';
import { CartService } from '../cart/cart.service';
import { CommonService } from '../common-services/common.service';
import { customerStore } from '../dashboard/customer.repository';
import { Address } from '../model/address.model';
import { CartItemDto } from '../model/cartItemDto.model';
import { CustomerDto } from '../model/CustomerDto.model';
import { AddressesComponent } from './addresses/addresses.component';
import { AddressesService } from './addresses/addresses.service';

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
  subItemCart!: Subscription;
  constructor(
    private formBuilder: FormBuilder,
    private addressesService: AddressesService,
    private cartService: CartService,
    private modal: NzModalService,
    private viewContainerRef: ViewContainerRef,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.currentCustomer = customerStore.getValue().customer!;

    // this.cartService
    //   .getProductCartByCusId(this.currentCustomer.id)
    //   .subscribe((res) => {
    //     this.cartItems = res.cartItemDtos;
    //     this.totalMoneyCart = this.cartItems.reduce(
    //       (a, b) => a + (b.amount * b.productDetailCartDto.price! || 0),
    //       0
    //     );
    //   });
    this.subItemCart = cartItemsStore
      .pipe(selectAllEntities())
      .subscribe((res) => {
        this.cartItems = res;
        this.totalMoneyCart = this.cartItems.reduce(
          (a, b) => a + (b.amount * b.productDetailCartDto.price! || 0),
          0
        );
      });

    this.addressesService
      .getAddressByCustomerId(this.currentCustomer.id)
      .subscribe((res) => {
        this.addresses = res;
      });
    this.formCheckout = this.formBuilder.group({
      recipientName: '',
      recipientPhone: '',
      recipientEmail: '',
      note: '',
      recipientAddress: [null, Validators.required],
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
  editAddress() {
    let addressEdited = this.formCheckout.get('recipientAddress')?.value;
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
            recipientAddress: result,
          });
        }
      });
    } else this.commonService.info('Vui lòng chọn địa chỉ');
  }
  removeAddress(address: Address, i: number) {
    this.commonService
      .confirm('Bạn có muốn xóa địa chỉ này không?')
      .then((res) => {
        if (res.isConfirmed) {
          this.addressesService
            .deleteAddressByCustomerId(this.currentCustomer.id)
            .subscribe((res) => {
              if (res) {
                this.addresses.splice(i, 1);
                this.commonService.success('Xóa địa chỉ thành công');
              }
            });
        }
      });
  }
  checkout() {}
  ngOnDestroy() {
    this.subItemCart.unsubscribe();
  }
}
