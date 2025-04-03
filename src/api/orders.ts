import axios from '@/lib/axios';
import { GetOrdersParams, OrdersResponse } from '@/types/order';

export const ordersApi = {
  async getOrders(params: GetOrdersParams): Promise<OrdersResponse> {
    const response = await axios.get<OrdersResponse>('/orders', { params });
    
    return response.data;
  }
}; 