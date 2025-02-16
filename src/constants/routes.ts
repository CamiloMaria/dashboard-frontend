export const BASE_PATH = '/dashboard-v2';

export const ROUTES = {
    AUTH: {
        LOGIN: `${BASE_PATH}/login`,
        FORGOT_PASSWORD: `${BASE_PATH}/forgot-password`,
        RESET_PASSWORD: `${BASE_PATH}/reset-password`,
    },
    INVENTORY: {
        ROOT: `${BASE_PATH}/inventory`,
        PRODUCTS: {
            LIST: `${BASE_PATH}/products`,
            NEW: `${BASE_PATH}/products/new`,
            EDITOR: `${BASE_PATH}/product/$productId`,
        },
        PROMOTIONS: `${BASE_PATH}/promotions`,
        // CATEGORIES: '/categories',
        PRODUCT_SETS: {
            LIST: `${BASE_PATH}/product-sets`,
            NEW: `${BASE_PATH}/product-sets/new`,
        }
    },
    ORDERS: `${BASE_PATH}/orders`,
    // CLIENTS: '/clients',
    PERMISSIONS: `${BASE_PATH}/permissions`,
    LOGS: `${BASE_PATH}/logs`,
} as const; 