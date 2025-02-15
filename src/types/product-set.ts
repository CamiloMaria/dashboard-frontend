import { Pagination } from "./pagination";


export interface GetProductSetsParams {
  page: number;
  limit: number;
  search?: string;
  order?: string;
  sortBy?: string;
}

export interface CreateSetPayload {
  title: string;
  selected_products: Array<{
    sku: string;
    price: number;
    is_free: boolean;
    grupo: string;
  }>;
}

export interface ProductInSet {
  id: number;
  sku: string;
  title: string;
  price: number;
  compare_price: number | null;
  grupo: string;
  depto: string;
}

export interface ProductSet {
  setSku: string;
  title: string;
  price: number;
  compare_price: number | null;
  area: string;
  products: ProductInSet[];
  create_at: string;
  update_at: string;
}

export interface ProductSetsResponse {
  data: ProductSet[];
  pagination: Pagination;
} 