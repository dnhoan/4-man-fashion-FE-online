export interface SearchProduct {
  status: number;
  name: string;
  categories?: number[];
  materials?: number[];
  models?: number[];
  colors?: number[];
  sizes?: number[];
  price?: number[];
  offset: number;
  limit: number;
  isLoading?: boolean;
  sort: number;
}
