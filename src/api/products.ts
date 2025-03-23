import { type Product, type ProductsResponse, type GetProductsParams, type ProductResponse, CreateProductResponse } from '@/types'
import axios from '@/lib/axios';

export const productsApi = {
  baseUrl: '/products',

  async getProducts(params: GetProductsParams) {
    const response = await axios.get<ProductsResponse>(this.baseUrl, {
      params
    });

    return response.data;
  },

  async getProduct(id: number) {
    const response = await axios.get<ProductResponse>(`${this.baseUrl}/${id}`);
    return response.data;
  },

  async createProduct(skus: string[]) {
    const response = await axios.post<CreateProductResponse>(this.baseUrl, {skus});
    return response.data;
  },

  async updateProduct(id: number, data: Partial<Product>): Promise<Product> {
    const response = await axios.patch<Product>(`${this.baseUrl}/${id}`, data);
    return response.data;
  },

  async deleteProduct(id: number): Promise<void> {
    await axios.delete(`${this.baseUrl}/${id}`);
  },

  async deleteProductImages(sku: string, ids: number[]): Promise<void> {
    await axios.delete(`/product/images/${sku}`, {
      params: { ids: ids.join(',') },
    });
  },

  async uploadProductImages(files: File[]): Promise<void> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    await axios.post('/product/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  async updateProductImages(sku: string, files: File[]): Promise<void> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    await axios.put(`/product/images/${sku}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  async generateDescription(title: string): Promise<string> {
    const response = await axios.post<string>('/product/generate/description', {
      title
    });

    return response.data;
  },

  async generateKeywords(title: string, category: string): Promise<string[]> {
    const response = await axios.post<string[]>('/product/generate/keywords', {
      title,
      category
    });

    return response.data;
  }
} 