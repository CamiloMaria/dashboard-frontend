import { GetProductSetsParams, ProductSetsResponse, CreateSetPayload } from '@/types/product-set';
import { 
    getMockProductSets,
    createMockProductSet,
    updateMockProductSetStatus
} from '@/mocks/productSetsMocks';

export const productSetsApi = {
    async getProductSets(params: GetProductSetsParams): Promise<ProductSetsResponse> {
        // const response = await axios.get<ProductSetsResponse>('/product-sets', {
        //     params
        // });
        
        // return response.data;
        
        // Simulate API call with mock data
        return getMockProductSets(params);
    },

    async createProductSet(payload: CreateSetPayload): Promise<void> {
        // await axios.post('/product-sets', payload);
        
        // Simulate API call with mock data
        createMockProductSet(payload);
        return Promise.resolve();
    },
    
    async updateProductSetStatus(setSku: string, status: boolean): Promise<void> {
        // await axios.patch(`/product-sets/${setSku}/status`, { status });
        
        // Simulate API call with mock data
        updateMockProductSetStatus(setSku, status);
        return Promise.resolve();
    },
};