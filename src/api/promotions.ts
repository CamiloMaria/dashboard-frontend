import { GetPromotionsParams, PromotionResponse } from '@/types/promotion';
import axios from '@/lib/axios';

export const promotionsApi = {
    async getPromotions(params: GetPromotionsParams): Promise<PromotionResponse> {
        const response = await axios.get<PromotionResponse>('/product-promotions', {
            params
        });
        return response.data;
    },
}; 