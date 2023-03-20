import { createStore } from '@ngneat/elf';
import { CartItemDto } from '../model/cartItemDto.model';
import { withEntities } from '@ngneat/elf-entities';

export const cartItemsStore = createStore(
  { name: 'cartItems' },
  withEntities<CartItemDto>()
);
