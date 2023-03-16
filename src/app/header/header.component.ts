import { Component, OnInit } from '@angular/core';
import { select } from '@ngneat/elf';
import { AuthService } from '../common-services/auth.service';
import { JwtService } from '../common-services/jwt.service';
import { customerStore } from '../dashboard/customer.repository';

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
    customerStore.pipe(select((state) => state.customer)).subscribe((cus) => {
      if (cus) {
        this.menuItemAccount = [
          { routerLink: 'dashboard', label: 'Thông tin cá nhân' },
          { routerLink: 'dashboard/order', label: 'Đơn hàng' },
          { routerLink: 'dashboard/address', label: 'Địa chỉ' },
        ];
      } else
        this.menuItemAccount = [
          { routerLink: 'login', label: 'đăng nhập' },
          { routerLink: 'signup', label: 'đăng ký' },
        ];
    });
  }
}
