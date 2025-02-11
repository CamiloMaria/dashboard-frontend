import { GetProductSetsParams, ProductSetsResponse, CreateSetPayload } from '@/types/product-set';
import { API_URL, getHeaders } from './config';
import axios from '@/lib/axios';

export const productSetsApi = {
    async getProductSets({ page, limit: size, search, order, sortBy }: GetProductSetsParams): Promise<ProductSetsResponse> {
        const response = await axios.get<ProductSetsResponse>(`${API_URL}/product/set`, {
            headers: getHeaders(),
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
        await axios.post(`${API_URL}/product/set`, {
            headers: getHeaders(),
            data: payload
        });
    },
};