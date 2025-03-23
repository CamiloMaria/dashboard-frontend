import axios from '@/lib/axios';
import { BaseResponse } from '@/types';

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

type SignInResponse = BaseResponse<SignInResult>;

export const authApi = {
    signIn: async (payload: SignInPayload): Promise<SignInResponse> => {
        const response = await axios.post<SignInResponse>(
            '/auth/sign-in',
            payload
        );
        
        return response.data;
    }
}; 