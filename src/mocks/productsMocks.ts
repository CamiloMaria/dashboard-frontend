import {
  Product,
  ProductsResponse,
  ProductResponse,
  CreateProductResponse,
  UpdateProductResponse,
  DeleteProductResponse,
  GenerateKeywordsResponse,
  GenerateDescriptionResponse,
  ProductStatus,
  CreateProductResult,
  ProductCreationStatus,
  UpdateProductResult,
  AtomicProductUpdate,
  AtomicProductUpdateResponse,
  GetProductsParams
} from '@/types';

// Mock product images
const mockImages = [
  {
    id: 1,
    product_id: 1,
    sku: 'PROD001',
    position: 1,
    width: 800,
    height: 600,
    alt: 'Product front view',
    id_cloudflare: 'cf123456',
    src: 'https://example.com/images/product1-1.jpg',
    created_at: '2023-01-15T10:30:00Z',
    updated_at: '2023-01-15T10:30:00Z',
    status: null
  },
  {
    id: 2,
    product_id: 1,
    sku: 'PROD001',
    position: 2,
    width: 800,
    height: 600,
    alt: 'Product side view',
    id_cloudflare: 'cf123457',
    src: 'https://example.com/images/product1-2.jpg',
    created_at: '2023-01-15T10:35:00Z',
    updated_at: '2023-01-15T10:35:00Z',
    status: null
  },
  {
    id: 3,
    product_id: 2,
    sku: 'PROD002',
    position: 1,
    width: 800,
    height: 600,
    alt: 'Product front view',
    id_cloudflare: 'cf223456',
    src: 'https://example.com/images/product2-1.jpg',
    created_at: '2023-01-16T11:30:00Z',
    updated_at: '2023-01-16T11:30:00Z',
    status: null
  }
];

// Mock product specifications
const mockSpecifications = [
  { title: 'Material', description: 'Wood' },
  { title: 'Dimensions', description: '100x50x75 cm' },
  { title: 'Weight', description: '5 kg' },
  { title: 'Color', description: 'Brown' }
];

// Mock product catalogs
const mockCatalogs = [
  {
    id: 1,
    stock: 50,
    shop: 'Main Store',
    price: 99.99,
    compare_price: 129.99,
    status: 1,
    status_comment: null,
    manual_override: false,
    status_changed_at: new Date('2023-01-10'),
    status_changed_by: 'admin',
    updated_at: new Date('2023-01-15')
  },
  {
    id: 2,
    stock: 25,
    shop: 'Online Store',
    price: 89.99,
    compare_price: 119.99,
    status: 1,
    status_comment: null,
    manual_override: false,
    status_changed_at: new Date('2023-01-10'),
    status_changed_by: 'admin',
    updated_at: new Date('2023-01-15')
  }
];

// Mock product category
const mockCategory = {
  id: 1,
  description: 'Furniture',
  group_sap: 'HOME',
  depto: 'Living Room',
  depto_sap: 'LR',
  area: 'Home',
  cat_app: 'Furniture',
  shops_stock: null,
  status: 1,
  level2: 'Tables',
  level3: 'Coffee Tables',
  level1_instaleap: 'Home',
  level2_instaleap: 'Furniture',
  level3_instaleap: 'Tables',
  bigItems: 1,
  delivery: 'Standard',
  delivery_depto: 'Furniture'
};

// Mock products
const mockProducts: Product[] = [
  {
    id: 1,
    sku: 'PROD001',
    title: 'Wooden Coffee Table',
    material: 'Wood',
    depto: 'Living Room',
    grupo: 'Furniture',
    type_tax: 1,
    description: 'Beautiful wooden coffee table for your living room.',
    description_instaleap: 'Elegant wooden coffee table with sturdy legs.',
    image_url: 'https://example.com/images/product1-1.jpg',
    unit: 'piece',
    isActive: true,
    without_stock: 0,
    borrado_comment: null,
    disabledShops: [],
    disabledShopsComment: null,
    shops_disable: [],
    userAdd: 'admin',
    userUpd: 'admin',
    is_set: 0,
    security_stock: 10,
    brand: 'WoodCraft',
    search_keywords: ['table', 'coffee', 'wood', 'furniture'],
    create_at: '2023-01-01T10:00:00Z',
    update_at: '2023-01-15T15:30:00Z',
    images: [mockImages[0], mockImages[1]],
    specifications: [mockSpecifications[0], mockSpecifications[1], mockSpecifications[2], mockSpecifications[3]],
    catalogs: mockCatalogs,
    category: mockCategory
  },
  {
    id: 2,
    sku: 'PROD002',
    title: 'Modern Desk Chair',
    material: 'Metal, Fabric',
    depto: 'Office',
    grupo: 'Furniture',
    type_tax: 1,
    description: 'Comfortable and ergonomic desk chair for your office.',
    description_instaleap: 'Ergonomic desk chair with adjustable height.',
    image_url: 'https://example.com/images/product2-1.jpg',
    unit: 'piece',
    isActive: true,
    without_stock: 0,
    borrado_comment: null,
    disabledShops: [],
    disabledShopsComment: null,
    shops_disable: [],
    userAdd: 'admin',
    userUpd: 'admin',
    is_set: 0,
    security_stock: 5,
    brand: 'OfficePro',
    search_keywords: ['chair', 'desk', 'office', 'ergonomic'],
    create_at: '2023-01-02T11:00:00Z',
    update_at: '2023-01-16T14:20:00Z',
    images: [mockImages[2]],
    specifications: [
      { title: 'Material', description: 'Metal frame, fabric seat' },
      { title: 'Dimensions', description: '60x60x110 cm' },
      { title: 'Weight', description: '8 kg' },
      { title: 'Color', description: 'Black' }
    ],
    catalogs: [
      {
        id: 3,
        stock: 30,
        shop: 'Main Store',
        price: 149.99,
        compare_price: 199.99,
        status: 1,
        status_comment: null,
        manual_override: false,
        status_changed_at: new Date('2023-01-12'),
        status_changed_by: 'admin',
        updated_at: new Date('2023-01-16')
      }
    ],
    category: {
      id: 2,
      description: 'Office Furniture',
      group_sap: 'OFFICE',
      depto: 'Office',
      depto_sap: 'OF',
      area: 'Office',
      cat_app: 'Furniture',
      shops_stock: null,
      status: 1,
      level2: 'Chairs',
      level3: 'Desk Chairs',
      level1_instaleap: 'Office',
      level2_instaleap: 'Furniture',
      level3_instaleap: 'Chairs',
      bigItems: 0,
      delivery: 'Standard',
      delivery_depto: 'Furniture'
    }
  },
  {
    id: 3,
    sku: 'PROD003',
    title: 'Bookshelf',
    material: 'Wood',
    depto: 'Living Room',
    grupo: 'Furniture',
    type_tax: 1,
    description: 'Spacious bookshelf for your books and decorations.',
    description_instaleap: 'Wooden bookshelf with 5 shelves.',
    image_url: 'https://example.com/images/product3-1.jpg',
    unit: 'piece',
    isActive: true,
    without_stock: 0,
    borrado_comment: null,
    disabledShops: [],
    disabledShopsComment: null,
    shops_disable: [],
    userAdd: 'admin',
    userUpd: 'admin',
    is_set: 0,
    security_stock: 8,
    brand: 'WoodCraft',
    search_keywords: ['bookshelf', 'shelf', 'wood', 'furniture'],
    create_at: '2023-01-03T09:30:00Z',
    update_at: '2023-01-17T11:45:00Z',
    images: null,
    specifications: [
      { title: 'Material', description: 'Wood' },
      { title: 'Dimensions', description: '80x30x180 cm' },
      { title: 'Weight', description: '15 kg' },
      { title: 'Color', description: 'Oak' }
    ],
    catalogs: [
      {
        id: 4,
        stock: 15,
        shop: 'Main Store',
        price: 199.99,
        compare_price: 249.99,
        status: 1,
        status_comment: null,
        manual_override: false,
        status_changed_at: new Date('2023-01-13'),
        status_changed_by: 'admin',
        updated_at: new Date('2023-01-17')
      }
    ],
    category: mockCategory
  }
];

// Function to get paginated products with filtering
export const getMockProducts = (params: GetProductsParams): ProductsResponse => {
  let filteredProducts = [...mockProducts];
  
  // Apply search if provided
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredProducts = filteredProducts.filter(product => 
      product.title.toLowerCase().includes(searchLower) || 
      product.sku.toLowerCase().includes(searchLower) || 
      product.description.toLowerCase().includes(searchLower) ||
      product.brand.toLowerCase().includes(searchLower)
    );
  }
  
  // Apply status filter if provided
  if (params.status) {
    filteredProducts = filteredProducts.filter(product => {
      if (params.status === ProductStatus.ACTIVE) {
        return product.isActive;
      } else {
        return !product.isActive;
      }
    });
  }
  
  // Apply bigItem filter if provided
  if (params.bigItem !== undefined) {
    filteredProducts = filteredProducts.filter(product => {
      return product.category?.bigItems === (params.bigItem ? 1 : 0);
    });
  }
  
  // Apply sorting if provided
  if (params.sortBy) {
    filteredProducts.sort((a, b) => {
      let aValue: unknown = a[params.sortBy as keyof Product];
      let bValue: unknown = b[params.sortBy as keyof Product];
      
      // Handle nested properties
      if (params.sortBy && params.sortBy.includes('.')) {
        const parts = params.sortBy.split('.');
        aValue = a;
        bValue = b;
        
        for (const part of parts) {
          if (aValue && bValue) {
            aValue = (aValue as Record<string, unknown>)[part];
            bValue = (bValue as Record<string, unknown>)[part];
          }
        }
      }
      
      if (aValue === bValue) return 0;
      
      // Handle string comparison
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return params.sortOrder === 'desc' 
          ? bValue.localeCompare(aValue) 
          : aValue.localeCompare(bValue);
      }
      
      // Handle number comparison
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return params.sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
      }
      
      // Default comparison (convert to string)
      return params.sortOrder === 'desc'
        ? String(bValue).localeCompare(String(aValue))
        : String(aValue).localeCompare(String(bValue));
    });
  }
  
  // Calculate pagination
  const startIndex = (params.page - 1) * params.limit;
  const endIndex = startIndex + params.limit;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  
  return {
    success: true,
    data: paginatedProducts,
    message: 'Products retrieved successfully',
    meta: {
      statusCode: 200,
      timestamp: new Date().toISOString(),
      pagination: {
        currentPage: params.page,
        itemsPerPage: params.limit,
        totalItems: filteredProducts.length,
        totalPages: Math.ceil(filteredProducts.length / params.limit)
      }
    }
  };
};

// Function to get a single product by ID
export const getMockProduct = (id: number): ProductResponse => {
  const product = mockProducts.find(p => p.id === id);
  
  if (!product) {
    return {
      success: false,
      data: {} as Product,
      message: `Product with ID ${id} not found`,
      meta: {
        statusCode: 404,
        timestamp: new Date().toISOString()
      }
    };
  }
  
  return {
    success: true,
    data: product,
    message: 'Product retrieved successfully',
    meta: {
      statusCode: 200,
      timestamp: new Date().toISOString()
    }
  };
};

// Function to create products from SKUs
export const createMockProduct = (skus: string[]): CreateProductResponse => {
  const results: CreateProductResult[] = skus.map(sku => {
    // Check if product with this SKU already exists
    const existingProduct = mockProducts.find(p => p.sku === sku);
    
    if (existingProduct) {
      return {
        sku,
        success: false,
        message: 'Product with this SKU already exists',
        status: ProductCreationStatus.EXISTING
      };
    }
    
    // Simulate successful creation
    return {
      sku,
      product: {
        sku,
        title: `New Product ${sku}`,
        description: `Description for ${sku}`,
        isActive: true,
        security_stock: 10
      },
      success: true,
      message: 'Product created successfully',
      status: ProductCreationStatus.CREATED
    };
  });
  
  return {
    success: true,
    data: results,
    message: 'Products creation processed',
    meta: {
      statusCode: 200,
      timestamp: new Date().toISOString()
    }
  };
};

// Function to update a product
export const updateMockProduct = (id: number, data: Partial<UpdateProductResult>): UpdateProductResponse => {
  const product = mockProducts.find(p => p.id === id);
  
  if (!product) {
    return {
      success: false,
      data: {} as UpdateProductResult,
      message: `Product with ID ${id} not found`,
      meta: {
        statusCode: 404,
        timestamp: new Date().toISOString()
      }
    };
  }
  
  // In a real implementation, we would update the product here
  
  return {
    success: true,
    data: {
      product: {
        title: data.product?.title || product.title,
        description_instaleap: data.product?.description_instaleap || product.description_instaleap,
        specifications: data.product?.specifications || JSON.stringify(product.specifications),
        search_keywords: data.product?.search_keywords || JSON.stringify(product.search_keywords),
        security_stock: data.product?.security_stock || product.security_stock
      },
      catalogs: data.catalogs || []
    },
    message: 'Product updated successfully',
    meta: {
      statusCode: 200,
      timestamp: new Date().toISOString()
    }
  };
};

// Function to delete a product
export const deleteMockProduct = (id: number): DeleteProductResponse => {
  const productIndex = mockProducts.findIndex(p => p.id === id);
  
  if (productIndex === -1) {
    return {
      success: false,
      data: undefined,
      message: `Product with ID ${id} not found`,
      meta: {
        statusCode: 404,
        timestamp: new Date().toISOString()
      }
    };
  }
  
  // In a real implementation, we would delete the product here
  
  return {
    success: true,
    data: undefined,
    message: 'Product deleted successfully',
    meta: {
      statusCode: 200,
      timestamp: new Date().toISOString()
    }
  };
};

// Function for atomic product update
export const atomicMockProductUpdate = (data: AtomicProductUpdate): AtomicProductUpdateResponse => {
  const product = mockProducts.find(p => p.sku === data.sku);
  
  if (!product) {
    return {
      success: false,
      data: {} as Product,
      message: `Product with SKU ${data.sku} not found`,
      meta: {
        statusCode: 404,
        timestamp: new Date().toISOString()
      }
    };
  }
  
  // In a real implementation, we would update the product here based on the atomic update data
  
  return {
    success: true,
    data: product,
    message: 'Product updated successfully',
    meta: {
      statusCode: 200,
      timestamp: new Date().toISOString()
    }
  };
};

// Function to generate product description
export const generateMockDescription = (productTitle: string): GenerateDescriptionResponse => {
  return {
    success: true,
    data: {
      description: `This is an automatically generated description for ${productTitle}. 
      It highlights the key features and benefits of this product. 
      Made with high-quality materials, this product is designed to last. 
      Perfect for both home and office use, it combines style and functionality.`
    },
    message: 'Description generated successfully',
    meta: {
      statusCode: 200,
      timestamp: new Date().toISOString()
    }
  };
};

// Function to generate product keywords
export const generateMockKeywords = (sku: string): GenerateKeywordsResponse => {
  const product = mockProducts.find(p => p.sku === sku);
  
  let keywords: string[] = [];
  
  if (product) {
    // Generate keywords based on product details
    keywords = [
      product.title.toLowerCase(),
      product.brand.toLowerCase(),
      product.material.toLowerCase(),
      product.category?.description.toLowerCase() || '',
      product.depto.toLowerCase()
    ].filter(Boolean);
    
    // Add some additional keywords
    if (product.title.includes('Table')) {
      keywords.push('furniture', 'home decor', 'living room');
    } else if (product.title.includes('Chair')) {
      keywords.push('seating', 'comfortable', 'office furniture');
    } else if (product.title.includes('Bookshelf')) {
      keywords.push('storage', 'books', 'display');
    }
  } else {
    // Generic keywords if product not found
    keywords = ['quality', 'durable', 'stylish', 'modern', 'home', 'furniture'];
  }
  
  return {
    success: true,
    data: {
      keywords: [...new Set(keywords)] // Remove duplicates
    },
    message: 'Keywords generated successfully',
    meta: {
      statusCode: 200,
      timestamp: new Date().toISOString()
    }
  };
}; 