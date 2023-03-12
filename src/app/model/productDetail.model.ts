import { ColorDTO } from './color.model';
import { SizeDTO } from './size.model';
import { ProductDTO } from './product.model';

export interface ProductDetail {
  id?: number | string;
  productId?: string;
  size?: SizeDTO;
  color?: ColorDTO;
  stock: number;
  productDetailCode?: string;
  productDetailName?: string;
  price?: number;
  sizeName?: string;
  colorName?: string;
  expand?: boolean;
  status?: number;
}

export interface ProductDetailDTO {
  id?: number | string;
  productId?: string;
  size?: SizeDTO;
  color?: ColorDTO;
  colorName?: string;
  stock: number;
  productDetailCode?: string;
  productDetailName?: string;
  price?: number;
  sizeName?: string;
  expand?: boolean;
  status?: number;
}
