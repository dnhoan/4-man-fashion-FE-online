import { Color } from './color.model';
import { Size } from './size.model';

export interface ProductDetailCartDto {
  id?: number | string;
  stock?: number;
  color?: Color;
  size?: Size;
  productDetailName?: string;
  price?: number;
}
