import { type GetProductsParams, UpdateProductResult, AtomicProductUpdate, AtomicProductUpdateResponse, GenerateDescriptionResponse, GenerateKeywordsResponse, UpdateProductResponse, DeleteProductResponse } from '@/types';
import { 
  getMockProducts,
  getMockProduct,
  createMockProduct,
  updateMockProduct,
  deleteMockProduct,
  atomicMockProductUpdate,
  generateMockDescription,
  generateMockKeywords
} from '@/mocks/productsMocks';

export const productsApi = {
  async getProducts(params: GetProductsParams) {
    // const response = await axios.get<ProductsResponse>('/products', {
    //   params
    // });

    // return response.data;
    
    // Simulate API call with mock data
    return getMockProducts(params);
  },

  async getProduct(id: number) {
    // const response = await axios.get<ProductResponse>(`/products/${id}`);
    // return response.data;
    
    // Simulate API call with mock data
    return getMockProduct(id);
  },

  async createProduct(skus: string[]) {
    // const response = await axios.post<CreateProductResponse>('/products', {skus});
    // return response.data;
    
    // Simulate API call with mock data
    return createMockProduct(skus);
  },

  async updateProduct(id: number, data: Partial<UpdateProductResult>): Promise<UpdateProductResponse> {
    // const response = await axios.patch<UpdateProductResponse>(`/products/${id}`, data);
    // return response.data;
    
    // Simulate API call with mock data
    return updateMockProduct(id, data);
  },

  async deleteProduct(id: number): Promise<DeleteProductResponse> {
    // const response = await axios.delete<DeleteProductResponse>(`/products/${id}`);
    // return response.data;
    
    // Simulate API call with mock data
    return deleteMockProduct(id);
  },

  async deleteProductImages(sku: string, ids: number[]): Promise<void> {
    // await axios.delete(`/product/images/${sku}`, {
    //   params: { ids: ids.join(',') },
    // });
    
    // Simulate successful API call
    console.log(`Mock: Deleted images ${ids.join(', ')} for product ${sku}`);
    return Promise.resolve();
  },

  async uploadProductImages(files: File[]): Promise<void> {
    // const formData = new FormData();
    // files.forEach(file => {
    //   formData.append('images', file);
    // });

    // await axios.post('/product/images', formData, {
    //   headers: {
    //     'Content-Type': 'multipart/form-data',
    //   },
    // });
    
    // Simulate successful API call
    console.log(`Mock: Uploaded ${files.length} images`);
    return Promise.resolve();
  },

  async updateProductImages(sku: string, files: File[]): Promise<void> {
    // const formData = new FormData();
    // files.forEach(file => {
    //   formData.append('images', file);
    // });

    // await axios.put(`/product/images/${sku}`, formData, {
    //   headers: {
    //     'Content-Type': 'multipart/form-data',
    //   },
    // });
    
    // Simulate successful API call
    console.log(`Mock: Updated ${files.length} images for product ${sku}`);
    return Promise.resolve();
  },

  async atomicProductUpdate(
    data: AtomicProductUpdate,
    files?: File[]
  ): Promise<AtomicProductUpdateResponse> {
    // const formData = new FormData();
    
    // // Add the JSON data
    // formData.append('data', JSON.stringify(data));
    
    // // Add the files if any
    // if (files && files.length > 0) {
    //   files.forEach(file => {
    //     formData.append('files', file);
    //   });
    // }
    
    // const response = await axios.post<AtomicProductUpdateResponse>(
    //   '/products/atomic-update',
    //   formData,
    //   {
    //     headers: {
    //       'Content-Type': 'multipart/form-data',
    //     },
    //   }
    // );
    
    // return response.data;
    
    // Simulate API call with mock data
    if (files && files.length > 0) {
      console.log(`Mock: Atomic update for product ${data.sku} with ${files.length} files`);
    } else {
      console.log(`Mock: Atomic update for product ${data.sku}`);
    }
    
    return atomicMockProductUpdate(data);
  },

  async generateDescription(productTitle: string): Promise<GenerateDescriptionResponse> {
    // const response = await axios.post<GenerateDescriptionResponse>('/products/generate-description', {
    //   productTitle
    // });

    // return response.data;
    
    // Simulate API call with mock data
    return generateMockDescription(productTitle);
  },

  async generateKeywords(sku: string): Promise<GenerateKeywordsResponse> {
    // const response = await axios.post<GenerateKeywordsResponse>('/products/generate-keywords', {
    //   sku
    // });

    // return response.data;
    
    // Simulate API call with mock data
    return generateMockKeywords(sku);
  }
} 