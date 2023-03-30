import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CommonService } from '../common-services/common.service';
import { RequestService } from '../common-services/request.service';
import { Address } from '../model/address.model';
import { AddressesService } from './addresses/addresses.service';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  constructor(
    private addressesService: AddressesService,
    private httpClient: HttpClient,
    private commonService: CommonService
  ) {}

  ngOnInit() {}
  getFeeShip(province: string, district: string, address: string) {
    let data = {
      package_type: 'express',
      pick_province: 'Hà Nội',
      pick_district: 'Quận Từ Liêm',
      province,
      district,
      address,
      weight: 500,
      value: 0,
      tags: [14],
      transport: 'road',
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${environment.token_ghtk}`,
    });
    return this.httpClient
      .post(`${environment.apiGHTK}`, data, { headers })
      .pipe(
        map((res: any) => {
          if (res.success) {
            return res.fee.ship_fee_only;
          }
          return 0;
        }),
        catchError(this.handleError<any>('Lỗi tính phí giao dịch', 0))
      );
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.commonService.error(operation);
      return of(result as T);
    };
  }
}
