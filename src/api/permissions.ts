import axios from '@/lib/axios';

interface User {
    id: string;
    username: string;
    codigo: string;
    allowedPages: string[];
}

interface GetUsersParams {
    page: number;
    limit: number;
    search?: string;
    order?: string;
    sortBy?: string;
}

interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        length: number;
    };
}

export const permissionsApi = {
    saveUserPermissions: async (user: User): Promise<void> => {
        await axios.post('/auth/user/permissions', {
            username: user.username,
            allowedPages: user.allowedPages
        });
    },

    getUserPermissions: async (username: string): Promise<User> => {
        const response = await axios.get<User>(`/permissions/users/${username}`);
        return response.data;
    },

    getAllUsers: async ({ page, limit, search, order, sortBy }: GetUsersParams): Promise<PaginatedResponse<User>> => {
        const response = await axios.get<PaginatedResponse<User>>('/auth/user/all', {
            params: {
                page,
                size: limit,
                search,
                order,
                sortBy,
            }
        });
        return response.data;
    },
}; 