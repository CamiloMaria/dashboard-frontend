import { GetPromotionsParams, PromotionResponse } from '@/types/promotion';
import { API_URL, getHeaders } from './config';
import axios from '@/lib/axios';

export const promotionsApi = {
    async getPromotions({ page, limit: size, search, order, sortBy }: GetPromotionsParams): Promise<PromotionResponse> {
        const response = await axios.get<PromotionResponse>(`${API_URL}/product/promotions`, {
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
}; 