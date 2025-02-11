import { Pagination } from "./pagination";

export interface GetPromotionsParams {
    page: number;
    limit: number;
    search?: string;
    order?: string;
    sortBy?: string;
}

export interface PromotionResponse {
    data: Promotion[];
    pagination: Pagination;
}

export interface Promotion {
    no_promo: number;
    sku: string;
    matnr: string;
    price: number;
    compare_price: number;
    shop: string;
    status: boolean;
    created_at: string;
} 