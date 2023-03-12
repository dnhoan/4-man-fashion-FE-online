import { Component, OnInit } from '@angular/core';
import { AuthService } from '../common-services/auth.service';
import { JwtService } from '../common-services/jwt.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  menuItemAccount: {
    routerLink: string;
    label: string;
  }[] = [];

  constructor(public jwtService: JwtService) {}

  ngOnInit(): void {
    if (this.jwtService.isLoggedIn()) {
      this.menuItemAccount = [
        { routerLink: 'profile-detail', label: 'Thông tin cá nhân' },
        { routerLink: 'profile-detail/order', label: 'Đơn hàng' },
        { routerLink: 'profile-detail/address', label: 'Địa chỉ' },
      ];
    } else
      this.menuItemAccount = [
        { routerLink: 'login', label: 'đăng nhập' },
        { routerLink: 'signup', label: 'đăng ký' },
      ];
  }
}
