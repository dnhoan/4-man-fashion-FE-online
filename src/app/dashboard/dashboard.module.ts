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
    OrderStatusPipe,
    ExchangeComponent,
    FormExchangeComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
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
