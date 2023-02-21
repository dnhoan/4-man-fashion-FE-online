import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { JwtService } from './jwt.service';
import { RequestService } from './request.service';

export interface AccountInfo {
  phoneOrEmail: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = environment.baseUrl;

  constructor(
    private readonly requestService: RequestService,
    private readonly jwtService: JwtService,
    private router: Router
  ) {}

  login(accountInfo: AccountInfo) {
    return this.requestService
      .post(`${this.baseUrl}/api/auth/login`, accountInfo, 'login')
      .pipe(
        map((res) => {
          if (res.code == '000') {
            this.jwtService.setJwtToken(res.data.token);
            this.router.navigate(['']);
            return true;
          }
          Swal.fire({
            title: 'Error!',
            text: 'Sai tài khoản hoặc mật khẩu',
            icon: 'error',
            confirmButtonText: 'Đóng',
          });
          return false;
        })
      );
  }
  signup(accountInfo: AccountInfo) {
    return this.requestService
      .post(`${this.baseUrl}/api/auth/signup`, accountInfo, 'Signup')
      .pipe(
        map((res) => {
          if (res.code == '000') {
            Swal.fire({
              title: 'Success!',
              text: 'Đăng ký tài khoản thành công',
              icon: 'success',
              confirmButtonText: 'Đóng',
            });
            this.router.navigate(['/login']);
            return true;
          }
          Swal.fire({
            title: 'Error!',
            text: 'Sai tài khoản hoặc mật khẩu',
            icon: 'error',
            confirmButtonText: 'Đóng',
          });
          return false;
        })
      );
  }
}
