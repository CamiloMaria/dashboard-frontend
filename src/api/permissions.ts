import axios from '@/lib/axios';
import { API_URL } from './config';

interface User {
    username: string;
    allowedPages: string[];
}

export const permissionsApi = {
    saveUserPermissions: async (user: User): Promise<void> => {
        await axios.post(`${API_URL}/permissions/users`, user);
    },

    getUserPermissions: async (username: string): Promise<User> => {
        const response = await axios.get<User>(`${API_URL}/permissions/users/${username}`);
        return response.data;
    },

    getAllUsers: async (): Promise<User[]> => {
        const response = await axios.get<User[]>(`${API_URL}/permissions/users`);
        return response.data;
    },
}; 