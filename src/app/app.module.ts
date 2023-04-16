import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ProductsComponent } from './products/products.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, registerLocaleData } from '@angular/common';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './common-services/auth.service';
import { JwtService } from './common-services/jwt.service';
import {
  JwtHelperService,
  JwtInterceptor,
  JwtModule,
} from '@auth0/angular-jwt';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonConstants } from './constants/common-constants';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import en from '@angular/common/locales/en';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgZorroAntdModule } from 'src/share_modules/ng-add-ng-zorro-antd.module';
import { AddressesComponent } from './checkout/addresses/addresses.component';
import { AddressComponent } from './dashboard/address/address.component';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NZ_CONFIG, NzConfig } from 'ng-zorro-antd/core/config';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { environment } from 'src/environments/environment';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
registerLocaleData(en);
const ngZorroConfig: NzConfig = {
  theme: {
    primaryColor: '#fb5c42',
  },
};
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    ProductDetailComponent,
    CartComponent,
    CheckoutComponent,
    ProductsComponent,
    LoginComponent,
    ResetPasswordComponent,
    SignupComponent,
    ForgotPasswordComponent,
    AddressesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SlickCarouselModule,
    FormsModule,
    NzPaginationModule,
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    NzModalModule,
    NgZorroAntdModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem(CommonConstants.TOKEN_KEY),
        allowedDomains: ['example.com'],
        disallowedRoutes: ['example.com/login'],
      },
    }),
    BrowserAnimationsModule,
  ],
  providers: [
    AuthGuard,
    AuthService,
    JwtService,
    JwtHelperService, // Add JwtHelperService to the providers array
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: NZ_I18N, useValue: en_US },
    { provide: NZ_CONFIG, useValue: ngZorroConfig },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
