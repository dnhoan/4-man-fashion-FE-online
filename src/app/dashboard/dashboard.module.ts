import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzRadioModule } from 'ng-zorro-antd/radio';

import { NzListModule } from 'ng-zorro-antd/list';
import { DashboardComponent } from './dashboard.component';
import { AddressComponent } from './address/address.component';
import { ProfileDetailsComponent } from './profile-details/profile-details.component';
import { OrdersComponent } from './orders/orders.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditAddressComponent } from './edit-address/edit-address.component';
import { FavoriteProductComponent } from './favorite-product/favorite-product.component';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { NgZorroAntdModule } from 'src/share_modules/ng-add-ng-zorro-antd.module';
import { OrderStatusPipe } from '../pipes/order-status.pipe';
import { ExchangeComponent } from './orders/exchange/exchange.component';
import { FormExchangeComponent } from './orders/exchange/form-exchange/form-exchange.component';

@NgModule({
  declarations: [
    DashboardComponent,
    ProfileDetailsComponent,
    AddressComponent,
    EditAddressComponent,
    OrdersComponent,
    ChangePasswordComponent,
    FavoriteProductComponent,
    OrderStatusPipe,
    ExchangeComponent,
    FormExchangeComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NzRadioModule,
    DashboardRoutingModule,
    ReactiveFormsModule,
    NzSelectModule,
    NzModalModule,
    NzInputModule,
    NzInputNumberModule,
    NzButtonModule,
    NzListModule,
    DashboardRoutingModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
  ],
  providers: [
    {
      provide: NzModalRef,
      useValue: {
        getInstance: () => {
          return {
            setFooterWithTemplate: () => {},
          };
        },
      },
    },
  ],
})
export class DashboardModule {}
