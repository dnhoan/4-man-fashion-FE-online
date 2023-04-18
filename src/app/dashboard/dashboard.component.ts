import { Component, OnInit } from '@angular/core';
import { JwtService } from '../common-services/jwt.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  activeNav = 'profile';
  nav = [
    {
      routerLink: 'profile',
      title: 'Thông tin cá nhân',
    },
    {
      routerLink: 'order',
      title: 'Đơn hàng',
    },
    {
      routerLink: 'address',
      title: 'Địa chỉ',
    },
    {
      routerLink: 'favorite-product',
      title: 'Sản phẩm yêu thích',
    },
    {
      routerLink: 'change-password',
      title: 'Thay đổi mật khẩu',
    },
  ];
  constructor(private jwtService: JwtService, private router: Router) {}

  ngOnInit(): void {
    let url = this.router.url;
    this.activeNav = this.nav.filter((n) =>
      n.routerLink.includes(url.split('/')[2])
    )[0].routerLink;
  }
  logout() {
    this.jwtService.removeJwtToken();
  }
  changeActive(item: any) {
    this.activeNav = item.routerLink;
  }
}
