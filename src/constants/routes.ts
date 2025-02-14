export const ROUTES = {
    AUTH: {
        LOGIN: '/login',
        FORGOT_PASSWORD: '/forgot-password',
        RESET_PASSWORD: '/reset-password',
    },
    DASHBOARD: '/',
    INVENTORY: {
        ROOT: '/inventory',
        PRODUCTS: {
            LIST: '/products',
            NEW: '/products/new',
            EDITOR: '/product/$productId',
        },
        PROMOTIONS: '/promotions',
        // CATEGORIES: '/categories',
        PRODUCT_SETS: {
            LIST: '/product-sets',
            NEW: '/product-sets/new',
        }
    },
    ORDERS: '/orders',
    // CLIENTS: '/clients',
    PERMISSIONS: '/permissions',
    LOGS: '/logs',
} as const; 