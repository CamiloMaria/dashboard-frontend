export const BASE_PATH = '/dashboard/v2';

const removeBasePath = (path: string) => path.replace(BASE_PATH, '');

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

// Version of routes without base path for specific use cases
export const ROUTES_WITHOUT_BASE = {
    AUTH: {
        LOGIN: removeBasePath(ROUTES.AUTH.LOGIN),
        FORGOT_PASSWORD: removeBasePath(ROUTES.AUTH.FORGOT_PASSWORD),
        RESET_PASSWORD: removeBasePath(ROUTES.AUTH.RESET_PASSWORD),
    },
    INVENTORY: {
        ROOT: removeBasePath(ROUTES.INVENTORY.ROOT),
        PRODUCTS: {
            LIST: removeBasePath(ROUTES.INVENTORY.PRODUCTS.LIST),
            NEW: removeBasePath(ROUTES.INVENTORY.PRODUCTS.NEW),
            EDITOR: removeBasePath(ROUTES.INVENTORY.PRODUCTS.EDITOR),
        },
        PROMOTIONS: removeBasePath(ROUTES.INVENTORY.PROMOTIONS),
        PRODUCT_SETS: {
            LIST: removeBasePath(ROUTES.INVENTORY.PRODUCT_SETS.LIST),
            NEW: removeBasePath(ROUTES.INVENTORY.PRODUCT_SETS.NEW),
        }
    },
    ORDERS: removeBasePath(ROUTES.ORDERS),
    PERMISSIONS: removeBasePath(ROUTES.PERMISSIONS),
    LOGS: removeBasePath(ROUTES.LOGS),
} as const; 