import { GetProductSetsParams, ProductSetsResponse, CreateSetPayload } from '@/types/product-set';
import axios from '@/lib/axios';

export const productSetsApi = {
    async getProductSets(params: GetProductSetsParams): Promise<ProductSetsResponse> {
        const response = await axios.get<ProductSetsResponse>('/product-sets', {
            params
        });
        
        return response.data;
    },

    async createProductSet(payload: CreateSetPayload): Promise<void> {
        await axios.post('/product-sets', payload);
    },
    
    async updateProductSetStatus(setSku: string, status: boolean): Promise<void> {
        await axios.patch(`/product-sets/${setSku}/status`, { status });
    },
};