import { CustomerDto } from "./CustomerDto.model";
import { Product, ProductDTO } from "./product.model";

export interface FavoriteProduct {
  id?: number;
  customer?: CustomerDto;
  product: ProductDTO;
  status?: number;
  ctime?: string;
}
