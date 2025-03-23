import axios from '@/lib/axios';
import { BaseResponse } from '@/types';
import { removeAuthSession } from '@/lib/auth';

interface SignInPayload {
    username: string;
    password: string;
}

interface SignInResult {
    user: {
        username: string;
        sub: string;
        email: string;
        allowedPages: string[];
    }
}

interface UserResult {
    user: {
        userId: string;
        username: string;
        sub: string;
        email: string;
        allowedPages: string[];
    }
}

type SignInResponse = BaseResponse<SignInResult>;
type UserResponse = BaseResponse<UserResult>;
type RefreshTokenResponse = BaseResponse<null>;

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
            '/auth/profile'
        );

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