import { z } from 'zod'
import { Pagination } from '.';

export const productFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  isActive: z.boolean(),
  borrado_comment: z.string().optional(),
  disabledShops: z.array(z.string()).default([]),
  disabledShopsComment: z.string().optional(),
})

export type ProductFormValues = z.infer<typeof productFormSchema> 

export interface GetProductsParams {
    page: number;
    limit: number;
    search?: string;
    order?: string;
    sortBy?: string;
}

export interface ProductsResponse {
    data: Product[];
    pagination: Pagination;
}

export interface Product {
    id: number;
    sku: string;
    title: string;
    material: string;
    depto: string;
    grupo: string;
    type_tax: number;
    description: string;
    description_instaleap: string;
    category: string;
    bigItems: number;
    image_url: string;
    unit: string;
    isActive: boolean;
    without_stock: number;
    borrado_comment: string | null;
    disabledShops: string[];
    disabledShopsComment: string | null;
    shops_disable: string[];
    userAdd: string;
    userUpd: string;
    is_set: number;
    security_stock: number;
    brand: string;
    search_keywords: string[];
    create_at: string;
    update_at: string;
    images: Image[];
    specifications: Specification[];
    inventory: Inventory[];
}

export interface Image {
    id: number;
    product_id: number;
    sku: string;
    position: number;
    width: number;
    height: number;
    alt: string;
    id_cloudflare: string;
    src: string;
    created_at: string;
    updated_at: string;
    status: null;
}

export interface Inventory {
    id: number;
    stock: number;
    centro: string;
    price: number;
    compare_price: number | null;
    status: number;
    fecha: string;
}

export interface Specification {
    title: string;
    description: string;
}

export interface CreateProductDto {
    num?: number;
    category?: string;
    title?: string;
    description?: string;
    description_instaleap?: string;
    tags?: string;
    sku?: string;
    barcode?: string;
    brand?: string;
    vendor?: string;
    borrado?: number;
    borrado_comment?: string;
    unit?: string;
    stock?: number;
    reserved?: string;
    cost?: string;
    taxPercent?: string;
    price?: number;
    price2?: number;
    price3?: number;
    compare_price?: number;
    weight?: string;
    thumbnail?: string;
    images_url?: string;
    isActive?: boolean;
    active_comment?: string;
    status?: number;
    without_stock?: number;
    matnr?: string;
    unmanejo?: string;
    tpean?: string;
    grupo?: string;
    depto?: string;
    type_tax?: number;
    userAdd?: string;
    userUpd?: string;
    update_at?: Date;
    specifications?: Array<{
        title: string;
        description: string;
    }>;
    shops_disable?: string;
    bigItems?: number;
    security_stock?: number;
    images?: string[];
}

export type ProductStatus = 'created' | 'updated' | 'failed';

export interface CreateProductResult extends Omit<CreateProductDto, 'status'> {
    status: ProductStatus;
    error?: string;
}