import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor() {}

  error(text: string) {
    Swal.fire({
      title: 'Lỗi!',
      text,
      icon: 'error',
      confirmButtonText: 'Đóng',
    });
  }
  info(text: string) {
    Swal.fire({
      title: 'Thông báo!',
      text,
      icon: 'info',
      confirmButtonText: 'Đóng',
    });
  }
  success(text: string) {
    Swal.fire({
      title: 'Thành công',
      text,
      icon: 'success',
      confirmButtonText: 'Đóng',
    });
  }
  confirm(title: string) {
    return Swal.fire({
      title,
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      denyButtonText: `Không`,
    });
  }
}
