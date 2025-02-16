import axios from '@/lib/axios';
import { GetOrdersParams, OrdersResponse } from '@/types/order';

export const ordersApi = {
  async getOrders({ 
    page, 
    limit: size, 
    search,
    order,
    sortBy,
    store
  }: GetOrdersParams): Promise<OrdersResponse> {
    const response = await axios.get<OrdersResponse>('/order', {
      params: {
        page,
        size,
        search,
        order,
        sortBy,
        store
      }
    });
    
    return response.data;
  }
}; 