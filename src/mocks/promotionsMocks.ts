import {
  Promotion,
  PromotionResponse,
  GetPromotionsParams
} from '@/types/promotion';

// Mock promotions
const mockPromotions: Promotion[] = [
  {
    no_promo: 1001,
    sku: 'PROD001',
    matnr: 'MAT001',
    price: 79.99,
    compare_price: 99.99,
    status: 1,
    shop: 'Main Store',
    product_title: 'Wooden Coffee Table',
    promo_mapa: 'SUMMER_SALE',
    create_at: '2023-06-01T10:00:00Z'
  },
  {
    no_promo: 1002,
    sku: 'PROD002',
    matnr: 'MAT002',
    price: 119.99,
    compare_price: 149.99,
    status: 1,
    shop: 'Main Store',
    product_title: 'Modern Desk Chair',
    promo_mapa: 'OFFICE_ESSENTIALS',
    create_at: '2023-06-02T11:00:00Z'
  },
  {
    no_promo: 1003,
    sku: 'PROD003',
    matnr: 'MAT003',
    price: 159.99,
    compare_price: 199.99,
    status: 1,
    shop: 'Online Store',
    product_title: 'Bookshelf',
    promo_mapa: 'HOME_DECOR',
    create_at: '2023-06-03T09:30:00Z'
  },
  {
    no_promo: 1004,
    sku: 'PROD004',
    matnr: 'MAT004',
    price: 39.99,
    compare_price: 49.99,
    status: 0, // Inactive promotion
    shop: 'Main Store',
    product_title: 'Desk Lamp',
    promo_mapa: 'LIGHTING_SALE',
    create_at: '2023-06-04T14:15:00Z'
  },
  {
    no_promo: 1005,
    sku: 'PROD005',
    matnr: 'MAT005',
    price: 349.99,
    compare_price: 399.99,
    status: 1,
    shop: 'Online Store',
    product_title: 'Bed Frame',
    promo_mapa: 'BEDROOM_ESSENTIALS',
    create_at: '2023-06-05T16:45:00Z'
  }
];

// Function to get paginated promotions with filtering
export const getMockPromotions = (params: GetPromotionsParams): PromotionResponse => {
  let filteredPromotions = [...mockPromotions];
  
  // Apply search if provided
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredPromotions = filteredPromotions.filter(promotion => 
      promotion.sku.toLowerCase().includes(searchLower) || 
      promotion.product_title.toLowerCase().includes(searchLower) || 
      promotion.promo_mapa.toLowerCase().includes(searchLower) ||
      promotion.shop.toLowerCase().includes(searchLower)
    );
  }
  
  // Apply sorting if provided
  if (params.sortBy) {
    filteredPromotions.sort((a, b) => {
      const aValue: unknown = a[params.sortBy as keyof Promotion];
      const bValue: unknown = b[params.sortBy as keyof Promotion];
      
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
  const paginatedPromotions = filteredPromotions.slice(startIndex, endIndex);
  
  return {
    success: true,
    data: paginatedPromotions,
    message: 'Promotions retrieved successfully',
    meta: {
      statusCode: 200,
      timestamp: new Date().toISOString(),
      pagination: {
        currentPage: params.page,
        itemsPerPage: params.limit,
        totalItems: filteredPromotions.length,
        totalPages: Math.ceil(filteredPromotions.length / params.limit)
      }
    }
  };
}; 