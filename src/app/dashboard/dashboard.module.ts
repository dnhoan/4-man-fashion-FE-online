import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { EditAddressComponent } from './edit-address/edit-address.component';
import { AddressComponent } from './address/address.component';
import { ProfileDetailsComponent } from './profile-details/profile-details.component';
import { OrdersComponent } from './orders/orders.component';

@NgModule({
  declarations: [
    DashboardComponent,
    ProfileDetailsComponent,
    AddressComponent,
    EditAddressComponent,
    OrdersComponent,
  ],
  imports: [CommonModule, DashboardRoutingModule],
})
export class DashboardModule {}
