import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CommonConstants } from '../constants/common-constants';
import { customerStore } from '../dashboard/customer.repository';
import { ROLE } from '../constants/constant.constant';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  constructor(
    private readonly jwtHelper: JwtHelperService,
    private router: Router,
    private message: NzMessageService
  ) {}

  public getJwtToken() {
    return localStorage.getItem(CommonConstants.TOKEN_KEY);
  }

  public setJwtToken(token: string) {
    let decode = this.jwtHelper.decodeToken(token!);
    if (decode.info.authorities[0].authority == ROLE.CUSTOMER) {
      localStorage.setItem(CommonConstants.TOKEN_KEY, token);
      this.getDecodedAccessToken();
      this.router.navigate(['']);
    } else {
      this.message.error('Sai tài khoản hoặc mật khẩu');
    }
  }

  public removeJwtToken(): void {
    localStorage.removeItem(CommonConstants.TOKEN_KEY);
    customerStore.update(() => ({ customer: null }));
    this.router.navigate(['login']);
  }

  public isTokenExpired(): boolean {
    const token = this.getJwtToken();
    return this.jwtHelper.isTokenExpired(token);
  }

  getDecodedAccessToken() {
    if (!this.isAuthenticated()) {
      customerStore.update(() => ({ customer: null }));
    }
    const token = localStorage.getItem(CommonConstants.TOKEN_KEY);
    try {
      let decode = this.jwtHelper.decodeToken(token!);
      customerStore.update(() => ({ customer: decode?.info.customerDto }));
    } catch (Error) {
      customerStore.update(() => ({ customer: null }));
    }
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(CommonConstants.TOKEN_KEY);

    return token && !this.isTokenExpired() ? true : false;
  }
}
