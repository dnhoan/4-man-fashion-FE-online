import { CustomerDto } from "./CustomerDto.model";

export interface Address {
  id?: number;
  wardCode?: number;
  ward?: string;
  districtCode?: number;
  district?: string;
  provinceCode?: number;
  province?: string;
  detail?: string;
  status?: number;
}
