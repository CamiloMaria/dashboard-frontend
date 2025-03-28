import { z } from 'zod'
import { BaseResponse, PaginatedResponse } from '.';

export const productFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  isActive: z.boolean(),
  disabledShops: z.array(z.string()).default([]),
  disabledShopsComment: z.string().optional(),
  borrado: z.number().default(0),
  borrado_comment: z.string().optional(),
  security_stock: z.number().min(0, 'Security stock must be 0 or greater').default(20),
})

export type ProductFormValues = z.infer<typeof productFormSchema> 

export enum ProductStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

export interface GetProductsParams {
    page: number;
    limit: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    status?: ProductStatus;
    bigItem?: boolean;
}

export type ProductsResponse = PaginatedResponse<Product[]>;
export type ProductResponse = BaseResponse<Product>;

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
    images: Image[] | null;
    specifications: Specification[] | null;
    catalogs: Catalog[] | null;
    category: Category | null;
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

export interface Catalog {
    id: number;
    stock: number;
    shop: string;
    price: number;
    compare_price: number | null;
    status: number;
    status_comment: string;
    manual_override: boolean;
    status_changed_at: Date;
    status_changed_by: string;
    updated_at: Date;
}


export interface Category {
    id: number;
    description: string;
    group_sap: string;
    depto: string | null;
    depto_sap: string | null;
    area: string | null;
    cat_app: string | null;
    shops_stock: string | null;
    status: number;
    level2: string | null;
    level3: string | null;
    level1_instaleap: string | null;
    level2_instaleap: string | null;
    level3_instaleap: string | null;
    bigItems: number;
    delivery: string;
    delivery_depto: string | null;
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

export enum ProductCreationStatus {
    CREATED = 'CREATED',
    EXISTING = 'EXISTING',
    NO_PRICE = 'NO_PRICE',
    ERROR = 'ERROR',
}

export interface CreateProductResult {
    sku: string;
    product?: CreateProductDto;
    success: boolean;
    message: string;
    status: ProductCreationStatus;
}

export type CreateProductResponse = BaseResponse<CreateProductResult[]>;

interface ProductUpdate {
    title: string;
    description_instaleap: string;
    /**
     * Array of objects
     * example: [{title: 'Color', description: 'Rojo'}, {title: 'Tamaño', description: '100x100cm'}]
     */
    specifications: JSON;
    /**
     * Array of strings
     * example: ['2157909', 'Simmons', 'colchón', 'colchones']
     */
    search_keywords: JSON;
    security_stock: number;
    click_multiplier: number;
    borrado: boolean;
    borrado_comment: string;
}

interface CatalogUpdate {
    id: number;
    status: number;
    status_comment: string;
    manual_override: boolean;
}

export interface UpdateProductResult {
    product: ProductUpdate;
    catalog: CatalogUpdate;
}

export type UpdateProductResponse = BaseResponse<UpdateProductResult>;

export interface GenerateKeywordsResult {
    keywords: string[];
}

export type GenerateKeywordsResponse = BaseResponse<GenerateKeywordsResult>;

export interface GenerateDescriptionResult {
    description: string;
}

export type GenerateDescriptionResponse = BaseResponse<GenerateDescriptionResult>;