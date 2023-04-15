import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from '../cart/cart.component';
import { AddressComponent } from './address/address.component';
import { EditAddressComponent } from './edit-address/edit-address.component';
import { DashboardComponent } from './dashboard.component';
import { OrdersComponent } from './orders/orders.component';
import { ProfileDetailsComponent } from './profile-details/profile-details.component';
import { FavoriteProductComponent } from './favorite-product/favorite-product.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: 'profile', component: ProfileDetailsComponent },
      { path: 'order', component: OrdersComponent },
      { path: 'cart', component: CartComponent },
      { path: 'favorite-product', component: FavoriteProductComponent },
      { path: 'change-password', component: ChangePasswordComponent },
      { path: 'address', component: AddressComponent },
      { path: '', pathMatch: 'full', redirectTo: 'profile' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
