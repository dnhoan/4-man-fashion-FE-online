import { Component } from '@angular/core';
import { JwtService } from './common-services/jwt.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private readonly jwtService: JwtService) {}

  ngOnInit() {
    this.jwtService.getDecodedAccessToken();
  }
}
