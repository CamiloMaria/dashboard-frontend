import { 
    SignInResponse, 
    UserResponse, 
    GetUsersResponse, 
    RefreshTokenResponse,
    GetLogsResponse,
    User,
    Log
} from '@/types/auth';

// Mock sign in response
export const mockSignInResponse: SignInResponse = {
    success: true,
    data: {
        user: {
            username: 'admin',
            sub: '1234567890',
            email: 'admin@example.com',
            allowedPages: ["/orders","/","/permissions","/inventory","/products","/product/$productId","/promotions","/product-sets","/product-sets/new","/products/new","/logs"],
        }
    },
    message: 'Login successful',
    meta: {
        statusCode: 200,
        timestamp: new Date().toISOString()
    }
};

// Mock user response
export const mockUserResponse: UserResponse = {
    success: true,
    data: {
        user: {
            userId: '1234567890',
            username: 'admin',
            email: 'admin@example.com',
            allowedPages: ["/orders","/","/permissions","/inventory","/products","/product/$productId","/promotions","/product-sets","/product-sets/new","/products/new","/logs"],
        }
    },
    message: 'User profile retrieved successfully',
    meta: {
        statusCode: 200,
        timestamp: new Date().toISOString()
    }
};

// Mock users for getAllUsers
const mockUsers: User[] = [
    {
        id: '1',
        username: 'admin',
        codigo: 'ADM001',
        email: 'admin@example.com',
        allowedPages: ["/orders","/","/permissions","/inventory","/products","/product/$productId","/promotions","/product-sets","/product-sets/new","/products/new","/logs"],
    },
    {
        id: '2',
        username: 'manager',
        codigo: 'MNG001',
        email: 'manager@example.com',
        allowedPages: ["/orders","/","/inventory","/products","/product/$productId","/promotions"],
    },
    {
        id: '3',
        username: 'staff',
        codigo: 'STF001',
        email: 'staff@example.com',
        allowedPages: ["/orders","/","/inventory"],
    }
];

// Mock users response with pagination
export const getMockUsersResponse = (page: number, limit: number, search?: string): GetUsersResponse => {
    let filteredUsers = [...mockUsers];
    
    // Apply search if provided
    if (search) {
        const searchLower = search.toLowerCase();
        filteredUsers = filteredUsers.filter(user => 
            user.username.toLowerCase().includes(searchLower) || 
            user.email.toLowerCase().includes(searchLower) ||
            user.codigo.toLowerCase().includes(searchLower)
        );
    }
    
    // Calculate pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
    
    return {
        success: true,
        data: paginatedUsers,
        message: 'Users retrieved successfully',
        meta: {
            statusCode: 200,
            timestamp: new Date().toISOString(),
            pagination: {
                currentPage: page,
                itemsPerPage: limit,
                totalItems: filteredUsers.length,
                totalPages: Math.ceil(filteredUsers.length / limit)
            }
        }
    };
};

// Mock logs for getLogs
const mockLogs: Log[] = [
    {
        id: 1,
        user: 'admin',
        type_log: 'LOGIN',
        field: 'auth',
        log: 'User logged in',
        details: null,
        date_timer: new Date(Date.now() - 3600000).toISOString()
    },
    {
        id: 2,
        user: 'admin',
        type_log: 'UPDATE',
        field: 'product',
        log: 'Product updated',
        details: 'Changed price from $10 to $15',
        date_timer: new Date(Date.now() - 7200000).toISOString()
    },
    {
        id: 3,
        user: 'manager',
        type_log: 'CREATE',
        field: 'order',
        log: 'Order created',
        details: 'Order #12345',
        date_timer: new Date(Date.now() - 10800000).toISOString()
    }
];

// Mock logs response with pagination
export const getMockLogsResponse = (page: number, limit: number, search?: string): GetLogsResponse => {
    let filteredLogs = [...mockLogs];
    
    // Apply search if provided
    if (search) {
        const searchLower = search.toLowerCase();
        filteredLogs = filteredLogs.filter(log => 
            log.user.toLowerCase().includes(searchLower) || 
            log.type_log.toLowerCase().includes(searchLower) ||
            log.field.toLowerCase().includes(searchLower) ||
            (log.log && log.log.toLowerCase().includes(searchLower)) ||
            (log.details && log.details.toLowerCase().includes(searchLower))
        );
    }
    
    // Calculate pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedLogs = filteredLogs.slice(startIndex, endIndex);
    
    return {
        success: true,
        data: paginatedLogs,
        message: 'Logs retrieved successfully',
        meta: {
            statusCode: 200,
            timestamp: new Date().toISOString(),
            pagination: {
                currentPage: page,
                itemsPerPage: limit,
                totalItems: filteredLogs.length,
                totalPages: Math.ceil(filteredLogs.length / limit)
            }
        }
    };
};

// Mock refresh token response
export const mockRefreshTokenResponse: SignInResponse = {
    success: true,
    data: {
        user: {
            username: 'admin',
            sub: '1234567890',
            email: 'admin@example.com',
            allowedPages: ["/orders","/","/permissions","/inventory","/products","/product/$productId","/promotions","/product-sets","/product-sets/new","/products/new","/logs"],
        }
    },
    message: 'Token refreshed successfully',
    meta: {
        statusCode: 200,
        timestamp: new Date().toISOString()
    }
};

// Mock sign out response
export const mockSignOutResponse: RefreshTokenResponse = {
    success: true,
    data: null,
    message: 'Logged out successfully',
    meta: {
        statusCode: 200,
        timestamp: new Date().toISOString()
    }
}; 