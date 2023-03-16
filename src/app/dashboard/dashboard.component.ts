import { Component, OnInit } from '@angular/core';
import { JwtService } from '../common-services/jwt.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(private jwtService: JwtService) {}

  ngOnInit(): void {}
  logout() {
    this.jwtService.removeJwtToken();
  }
}
