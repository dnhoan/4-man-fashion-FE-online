import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CommonService } from '../common-services/common.service';
import { RequestService } from '../common-services/request.service';
import { Address } from '../model/address.model';
import { AddressesService } from './addresses/addresses.service';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  constructor(private addressesService: AddressesService) {}

  ngOnInit() {}
}
