import { type Product, type ProductsResponse, type GetProductsParams, CreateProductResult } from '@/types'
import axios from '@/lib/axios';
import { API_URL, getHeaders } from './config';

export const productsApi = {
  async getProducts({ page, limit: size, search, order, sortBy }: GetProductsParams): Promise<ProductsResponse> {
    const response = await axios.get<ProductsResponse>(`${API_URL}/product`, {
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

  async getProduct(id: number): Promise<Product> {
    const response = await this.getProducts({search: id.toString(), page: 1, limit: 1})
    return response.data[0];
  },

  async createProduct(skus: string[]): Promise<CreateProductResult[]> {
    const response = await axios.post<CreateProductResult[]>(`${API_URL}/product`, {skus}, {
      headers: getHeaders()
    });
    return response.data;
  },

  async updateProduct(id: number, data: Partial<Product>): Promise<Product> {
    const response = await axios.put<Product>(`${API_URL}/product/${id}`, data, {
      headers: getHeaders()
    });
    return response.data;
  },

  async deleteProduct(id: number): Promise<void> {
    await axios.delete(`${API_URL}/product/${id}`, {
      headers: getHeaders()
    });
  },
} 