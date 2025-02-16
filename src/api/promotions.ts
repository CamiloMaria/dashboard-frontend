import { GetPromotionsParams, PromotionResponse } from '@/types/promotion';
import axios from '@/lib/axios';

export const promotionsApi = {
    async getPromotions({ page, limit: size, search, order, sortBy }: GetPromotionsParams): Promise<PromotionResponse> {
        const response = await axios.get<PromotionResponse>('/product/promotions', {
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
}; 