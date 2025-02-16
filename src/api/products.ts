import { type Product, type ProductsResponse, type GetProductsParams, CreateProductResult } from '@/types'
import axios from '@/lib/axios';

export const productsApi = {
  async getProducts({ page, limit: size, search, order, sortBy }: GetProductsParams): Promise<ProductsResponse> {
    const response = await axios.get<ProductsResponse>('/product', {
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
    const response = await axios.post<CreateProductResult[]>('/product', {skus});
    return response.data;
  },

  async updateProduct(sku: string, data: Partial<Product>): Promise<Product> {
    const response = await axios.patch<Product>(`/product/${sku}`, data);
    return response.data;
  },

  async deleteProduct(id: number): Promise<void> {
    await axios.delete(`/product/${id}`);
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