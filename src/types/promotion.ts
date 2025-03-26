import { PaginatedResponse } from "./response";

export interface GetPromotionsParams {
    page: number;
    limit: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
}
export interface Promotion {
    no_promo: number;
    sku: string;
    matnr: string;
    price: number;
    compare_price: number;
    status: number;
    shop: string;
    product_title: string;
    promo_mapa: string;
    create_at: string;
} 

export type PromotionResponse = PaginatedResponse<Promotion[]>;