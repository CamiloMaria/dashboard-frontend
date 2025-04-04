import axios from '@/lib/axios';
import { removeAuthSession } from '@/lib/auth';
import { SignInPayload, SignInResponse, UserResponse, RefreshTokenResponse, GetUsersParams, GetUsersResponse, UserPermissions, GetLogsParams, GetLogsResponse } from '@/types/auth';

export const authApi = {
    signIn: async (payload: SignInPayload) => {
        const response = await axios.post<SignInResponse>(
            '/auth/sign-in',
            payload
        );
        
        return response.data;
    },
    getUser: async () => {
        const response = await axios.get<UserResponse>(
            '/auth/user/profile'
        );
        
        return response.data;
    },
    getAllUsers: async (params: GetUsersParams) => {
        const response = await axios.get<GetUsersResponse>(
            '/auth/users',
            { params }
        );

        return response.data;
    },
    saveUserPermissions: async (user: UserPermissions): Promise<void> => {
        await axios.post('/auth/user/permissions', user);
    },
    getLogs: async (params: GetLogsParams): Promise<GetLogsResponse> => {
        const response = await axios.get<GetLogsResponse>('/auth/user/logs', { params });
        return response.data;
    },
    refreshToken: async () => {
        const response = await axios.post<SignInResponse>(
            '/auth/refresh'
        );

        return response.data;
    },
    signOut: async () => {
        try {
            await axios.post<RefreshTokenResponse>(
                '/auth/logout'
            );
        } finally {
            // Even if the API call fails, we still want to clear the session locally
            removeAuthSession();
        }
    }
}; 