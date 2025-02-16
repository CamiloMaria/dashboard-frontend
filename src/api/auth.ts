import axios from '@/lib/axios';

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
            '/auth/sign-in',
            payload
        );
        return response.data;
    }
}; 