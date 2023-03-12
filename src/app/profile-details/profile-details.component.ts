import { Component, OnInit } from '@angular/core';
import { JwtService } from '../common-services/jwt.service';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss'],
})
export class ProfileDetailsComponent implements OnInit {
  constructor(private jwtService: JwtService) {}

  ngOnInit(): void {}

  logout() {
    this.jwtService.removeJwtToken();
  }
}
