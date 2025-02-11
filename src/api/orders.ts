import axios from '@/lib/axios';
import { GetOrdersParams, OrdersResponse } from '@/types/order';
import { API_URL, getHeaders } from './config';

export const ordersApi = {
  async getOrders({ 
    page, 
    limit: size, 
    search,
    order,
    sortBy,
    store
  }: GetOrdersParams): Promise<OrdersResponse> {
    const response = await axios.get<OrdersResponse>(`${API_URL}/order`, {
      headers: getHeaders(),
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