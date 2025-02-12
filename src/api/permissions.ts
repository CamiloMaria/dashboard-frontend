import axios from '@/lib/axios';
import { API_URL, getHeaders } from './config';

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
        await axios.post(`${API_URL}/auth/user/permissions`, {
            username: user.username,
            allowedPages: user.allowedPages
        }, {
            headers: getHeaders(),
        });
    },

    getUserPermissions: async (username: string): Promise<User> => {
        const response = await axios.get<User>(`${API_URL}/permissions/users/${username}`);
        return response.data;
    },

    getAllUsers: async ({ page, limit, search, order, sortBy }: GetUsersParams): Promise<PaginatedResponse<User>> => {
        const response = await axios.get<PaginatedResponse<User>>(`${API_URL}/auth/user/all`, {
            headers: getHeaders(),
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