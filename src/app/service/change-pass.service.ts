import { DataResetPass } from './../reset-password/reset-password.component';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { RequestService } from '../common-services/request.service';
import { DataChangePass } from '../dashboard/change-password/change-password.component';

@Injectable({
  providedIn: 'root',
})
export class ChangePassService {
  apiChangePass = `${environment.baseUrl}/api/auth`;
  constructor(
    private requestService: RequestService,
  ) { }


  resetPassword(email: string, dataResetPass: DataResetPass) {
    return this.requestService
      .get(
        `${this.apiChangePass}/resetPassword?email=${email}&isOtp=${dataResetPass.isOtp}&newPassword=${dataResetPass.newPassword}&rePassword=${dataResetPass.rePassword}`,
        'Khôi phục mật khẩu'
      )
      .pipe(
        map((res) => {
          if (res.code == '000') {
            return res;
          } else {
            Swal.fire({
              title: 'Error!',
              text: res.desc,
              icon: 'error',
              confirmButtonText: 'Đóng',
            });
            return res;
          }
        })
      );
  }

  getOTP(email: string) {
    return this.requestService
      .get(
        `${this.apiChangePass}/forgot?email=${email}`,
        'Lấy mã OTP'
      )
      .pipe(
        map((res) => {
          if (res.code == '000') {
            return res;
          } else {
            Swal.fire({
              title: 'Error!',
              text: res.desc,
              icon: 'error',
              confirmButtonText: 'Đóng',
            });
            return res;
          }
        })
      );
  }

  changePass(phoneOrEmail: string, dataChange: DataChangePass) {
    return this.requestService
      .get(
        `${this.apiChangePass}/changepass?phoneOrEmail=${phoneOrEmail}&password=${dataChange.password}&newPassword=${dataChange.newPassword}&repassword=${dataChange.rePassword}`,
        'Thay đổi mật khẩu người dùng'
      )
      .pipe(
        map((res) => {
          if (res.code == '000') {
            return res;
          } else {
            Swal.fire({
              title: 'Error!',
              text: res.desc,
              icon: 'error',
              confirmButtonText: 'Đóng',
            });
            return res;
          }
        })
      );
  }
}
