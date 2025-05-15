import {
  ProductSet,
  ProductSetsResponse,
  GetProductSetsParams,
  CreateSetPayload
} from '@/types/product-set';

// Mock product sets
const mockProductSets: ProductSet[] = [
  {
    set_sku: 'SET001',
    title: 'Living Room Essentials',
    price: 499.99,
    compare_price: 599.99,
    area: 'Living Room',
    products: [
      {
        productSku: 'PROD001', // Wooden Coffee Table
        is_free: 0,
        title: 0, // This appears to be a numeric value in the type definition
        price: 99.99,
        compare_price: 129.99
      },
      {
        productSku: 'PROD003', // Bookshelf
        is_free: 0,
        title: 0,
        price: 199.99,
        compare_price: 249.99
      }
    ],
    status: true,
    create_at: '2023-02-01T10:00:00Z',
    update_at: '2023-02-15T15:30:00Z'
  },
  {
    set_sku: 'SET002',
    title: 'Office Setup Bundle',
    price: 299.99,
    compare_price: 349.99,
    area: 'Office',
    products: [
      {
        productSku: 'PROD002', // Modern Desk Chair
        is_free: 0,
        title: 0,
        price: 149.99,
        compare_price: 199.99
      },
      {
        productSku: 'PROD004', // Desk Lamp (imaginary product)
        is_free: 1, // This one is free
        title: 0,
        price: 49.99,
        compare_price: 69.99
      }
    ],
    status: true,
    create_at: '2023-02-05T11:00:00Z',
    update_at: '2023-02-20T14:20:00Z'
  },
  {
    set_sku: 'SET003',
    title: 'Bedroom Collection',
    price: 799.99,
    compare_price: 999.99,
    area: 'Bedroom',
    products: [
      {
        productSku: 'PROD005', // Bed Frame (imaginary product)
        is_free: 0,
        title: 0,
        price: 399.99,
        compare_price: 499.99
      },
      {
        productSku: 'PROD006', // Mattress (imaginary product)
        is_free: 0,
        title: 0,
        price: 299.99,
        compare_price: 399.99
      },
      {
        productSku: 'PROD007', // Bedside Table (imaginary product)
        is_free: 0,
        title: 0,
        price: 99.99,
        compare_price: 129.99
      }
    ],
    status: false, // Inactive set
    create_at: '2023-02-10T09:30:00Z',
    update_at: '2023-02-25T11:45:00Z'
  }
];

// Function to get paginated product sets with filtering
export const getMockProductSets = (params: GetProductSetsParams): ProductSetsResponse => {
  let filteredSets = [...mockProductSets];
  
  // Apply search if provided
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredSets = filteredSets.filter(set => 
      set.title.toLowerCase().includes(searchLower) || 
      set.set_sku.toLowerCase().includes(searchLower) || 
      set.area.toLowerCase().includes(searchLower)
    );
  }
  
  // Apply sorting if provided
  if (params.sortBy) {
    filteredSets.sort((a, b) => {
      const aValue: unknown = a[params.sortBy as keyof ProductSet];
      const bValue: unknown = b[params.sortBy as keyof ProductSet];
      
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
  const paginatedSets = filteredSets.slice(startIndex, endIndex);
  
  return {
    success: true,
    data: paginatedSets,
    message: 'Product sets retrieved successfully',
    meta: {
      statusCode: 200,
      timestamp: new Date().toISOString(),
      pagination: {
        currentPage: params.page,
        itemsPerPage: params.limit,
        totalItems: filteredSets.length,
        totalPages: Math.ceil(filteredSets.length / params.limit)
      }
    }
  };
};

// Function to create a product set
export const createMockProductSet = (payload: CreateSetPayload): void => {
  // In a real implementation, we would add the set to the database
  // Here we just simulate the creation
  
  // Create a new product set from the payload
  const newSet: ProductSet = {
    set_sku: `SET${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    title: payload.title,
    price: payload.products.reduce((total, product) => total + (product.isFree ? 0 : 50), 199.99), // Mock price calculation
    compare_price: payload.products.reduce((total, product) => total + (product.isFree ? 0 : 70), 299.99), // Mock compare price calculation
    area: 'New Set', // Default area
    products: payload.products.map(product => ({
      productSku: product.sku,
      is_free: product.isFree ? 1 : 0,
      title: 0,
      price: 99.99, // Mock price
      compare_price: 129.99 // Mock compare price
    })),
    status: true,
    create_at: new Date().toISOString(),
    update_at: new Date().toISOString()
  };
  
  // In a real implementation, we would add this to the database
  console.log(`Mock: Created new product set "${newSet.title}" with SKU ${newSet.set_sku}`);
};

// Function to update a product set status
export const updateMockProductSetStatus = (setSku: string, status: boolean): void => {
  const setIndex = mockProductSets.findIndex(set => set.set_sku === setSku);
  
  if (setIndex !== -1) {
    // In a real implementation, we would update the status in the database
    mockProductSets[setIndex].status = status;
    mockProductSets[setIndex].update_at = new Date().toISOString();
    console.log(`Mock: Updated product set ${setSku} status to ${status ? 'active' : 'inactive'}`);
  } else {
    console.log(`Mock: Product set ${setSku} not found`);
  }
}; 