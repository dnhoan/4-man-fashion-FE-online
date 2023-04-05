import { Component, OnInit } from '@angular/core';
import { JwtService } from '../common-services/jwt.service';

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
  ];
  constructor(private jwtService: JwtService) {}

  ngOnInit(): void {}
  logout() {
    this.jwtService.removeJwtToken();
  }
  changeActive(item: any) {
    this.activeNav = item.routerLink;
  }
}
