import { GetPromotionsParams, PromotionResponse } from '@/types/promotion';
import { getMockPromotions } from '@/mocks/promotionsMocks';

export const promotionsApi = {
    async getPromotions(params: GetPromotionsParams): Promise<PromotionResponse> {
        // const response = await axios.get<PromotionResponse>('/product-promotions', {
        //     params
        // });
        // return response.data;
        
        // Simulate API call with mock data
        return getMockPromotions(params);
    },
}; 