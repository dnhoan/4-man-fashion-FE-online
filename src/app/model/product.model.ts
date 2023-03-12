import { Material } from './material.model';
import { Category } from './category.model';
import { Models } from './model.model';
import { ProductDetail, ProductDetailDTO } from './productDetail.model';
import { Size } from './size.model';
import { Color } from './color.model';

export interface Product {
  id: number;
  productId: string;
  productName?: string;
  description?: String;
  detail?: string;
  material?: Material;
  category?: Category;
  model?: Models;
  gender?: number;
  materialName?: string;
  categoryName?: string;
  modelName?: string;
  status?: number;
  ctime?: Date;
  mtime?: Date;
  expand?: boolean;
  productImages?: {
    id?: number;
    image: string;
  }[];
  productDetails: ProductDetail[];
}

export interface ProductDTO {
  id: number;
  productId: string;
  productName?: string;
  description?: String;
  detail?: string;
  material?: Material;
  category?: Category;
  model?: Models;
  gender?: number;
  materialName?: string;
  categoryName?: string;
  modelName?: string;
  status?: number;
  ctime?: Date;
  mtime?: Date;
  expand?: boolean;
  sizes?: Size[];
  colors?: Color[];
  productImages?: {
    id?: number;
    image: string;
  }[];
  productDetails: ProductDetailDTO[];
}
