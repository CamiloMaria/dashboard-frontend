import { GetOrdersParams, OrdersResponse, PrintOrderBody, PrintOrderResponse, SpoolerResponse } from '@/types/order';
import { 
  getMockOrders,
  getMockSpooler,
  mockPrintOrder
} from '@/mocks/ordersMocks';

export const ordersApi = {
  async getOrders(params: GetOrdersParams): Promise<OrdersResponse> {
    // const response = await axios.get<OrdersResponse>('/orders', { params });
    // return response.data;
    
    // Simulate API call with mock data
    return getMockOrders(params);
  },

  async getSpooler(): Promise<SpoolerResponse> {
    // const response = await axios.get<SpoolerResponse>('/orders/spooler');
    // return response.data;
    
    // Simulate API call with mock data
    return getMockSpooler();
  },

  async printOrder(body: PrintOrderBody): Promise<PrintOrderResponse> {
    // const response = await axios.post<PrintOrderResponse>('/orders/print', body);
    // return response.data;
    
    // Simulate API call with mock data
    return mockPrintOrder(body);
  }
}; 