import { GetLogsParams } from "@/types/log";
import { GetOrdersParams } from "@/types/order";
import { GetProductsParams } from "@/types/product";
import { GetProductSetsParams } from "@/types/product-set";
import { GetPromotionsParams } from "@/types/promotion";

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all] as const,
  list: (filters: GetProductsParams) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string | number | undefined) => [...productKeys.details(), id] as const,
  search: (search: string) => [...productKeys.all, { search }] as const,
} as const;

export const productSetsKeys = {
    all: ['productSets'] as const,
    lists: () => [...productSetsKeys.all] as const,
    list: (filters: GetProductSetsParams) => [...productSetsKeys.lists(), filters] as const,
} as const;

export const promotionKeys = {
    all: ['promotions'] as const,
    lists: () => [...promotionKeys.all] as const,
    list: (filters: GetPromotionsParams) => [...promotionKeys.lists(), filters] as const,
} as const;

export const orderKeys = {
    all: ['orders'] as const,
    lists: () => [...orderKeys.all] as const,
    list: (filters: GetOrdersParams) => [...orderKeys.lists(), filters] as const,
} as const;

export const logKeys = {
    all: ['logs'] as const,
    lists: () => [...logKeys.all] as const,
    list: (filters: GetLogsParams) => [...logKeys.lists(), filters] as const,
} as const;
