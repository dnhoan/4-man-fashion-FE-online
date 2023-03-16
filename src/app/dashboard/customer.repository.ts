import { createStore, withProps } from '@ngneat/elf';
import { Injectable } from '@angular/core';
import { CustomerDto } from '../model/CustomerDto.model';
interface CustomerDrops {
  customer: CustomerDto | null;
}
export const customerStore = createStore(
  { name: 'customer' },
  withProps<CustomerDrops>({
    customer: null,
  })
);

@Injectable({ providedIn: 'root' })
export class CustomerRepository {}
