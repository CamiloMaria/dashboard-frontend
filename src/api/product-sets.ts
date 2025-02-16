import { GetProductSetsParams, ProductSetsResponse, CreateSetPayload } from '@/types/product-set';
import axios from '@/lib/axios';

export const productSetsApi = {
    async getProductSets({ page, limit: size, search, order, sortBy }: GetProductSetsParams): Promise<ProductSetsResponse> {
        const response = await axios.get<ProductSetsResponse>('/product/set', {
            params: {
                page,
                size,
                search,
                order,
                sortBy
            }
        });
        return response.data;
    },

    async createProductSet(payload: CreateSetPayload): Promise<void> {
        await axios.post('/product/set', {
            data: payload
        });
    },
};