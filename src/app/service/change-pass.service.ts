import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { RequestService } from '../common-services/request.service';
import { FavoriteProduct } from '../model/favoriteProduct.model';
import { CommonService } from '../common-services/common.service';
import { SearchOption } from '../model/search-option.model';
import { DataChangePass } from '../dashboard/change-password/change-password.component';

@Injectable({
  providedIn: 'root',
})
export class ChangePassService {
  apiChangePass = `${environment.baseUrl}/api/auth`;
  constructor(
    private requestService: RequestService,
  ) {}

  changePass(email: string, dataChange: DataChangePass) {
    return this.requestService
      .get(
        `${this.apiChangePass}/changepass?email=${email}&password=${dataChange.password}&newPassword=${dataChange.newPassword}&repassword=${dataChange.rePassword}`,
        'Thay đổi mật khẩu người dùng'
      )
      .pipe(
        map((res) => {
          if (res.code == '000') {
            return res.data;
          } else {
            Swal.fire({
              title: 'Error!',
              text: 'Lỗi thay đổi mật khẩu người dùng!',
              icon: 'error',
              confirmButtonText: 'Đóng',
            });
            return false;
          }
        })
      );
  }
}
