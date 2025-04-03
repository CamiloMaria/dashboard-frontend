import axios from '@/lib/axios';
import { GetOrdersParams, OrdersResponse, PrintOrderBody, PrintOrderResponse, SpoolerResponse } from '@/types/order';

export const ordersApi = {
  async getOrders(params: GetOrdersParams): Promise<OrdersResponse> {
    const response = await axios.get<OrdersResponse>('/orders', { params });
    return response.data;
  },

  async getSpooler(): Promise<SpoolerResponse> {
    const response = await axios.get<SpoolerResponse>('/orders/spooler');
    return response.data;
  },

  async printOrder(body: PrintOrderBody): Promise<PrintOrderResponse> {
    const response = await axios.post<PrintOrderResponse>('/orders/print', body);
    return response.data;
  }
}; 