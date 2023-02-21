import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommonConstants {
  public static readonly TOKEN_KEY = 'token';

  public static readonly P_EMAIL = '/^[w-.]+@([w-]+.)+[w-]{2,4}$/';
  public static readonly P_PHONE_NUMBER = '/(0[3|5|7|8|9])+([0-9]{8})\b/';
  public static readonly P_PASSWORD =
    '^(?=.*[!@#$%^&*]+)[a-z0-9!@#$%^&*]{6,32}$';
}
