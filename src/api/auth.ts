import axios from '@/lib/axios';
import { API_URL } from './config';

interface SignInPayload {
    username: string;
    password: string;
}

interface SignInResponse {
    access_token: string;
}

export const authApi = {
    signIn: async (payload: SignInPayload): Promise<SignInResponse> => {
        const response = await axios.post<SignInResponse>(
            `${API_URL}/auth/sign-in`,
            payload
        );
        return response.data;
    }
}; 