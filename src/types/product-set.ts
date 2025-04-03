import { PaginatedResponse } from "./response";

export interface GetProductSetsParams {
  page: number;
  limit: number;
  search?: string;
  sortOrder?: string;
  sortBy?: string;
}

export interface CreateSetPayload {
  title: string;
  products: Array<{
    sku: string;
    isFree?: boolean;
  }>;
}

export interface ProductInSet {
  productSku: string;
  is_free: number;
  title: number;
  price: number;
  compare_price: number | null;
}

export interface ProductSet {
  set_sku: string;
  title: string;
  price: number;
  compare_price: number | null;
  area: string;
  products: ProductInSet[];
  create_at: string;
  update_at: string;
}

export type ProductSetsResponse = PaginatedResponse<ProductSet[]>;