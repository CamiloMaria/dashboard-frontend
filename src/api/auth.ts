import { removeAuthSession } from '@/lib/auth';
import { SignInPayload, SignInResponse, UserResponse, GetUsersParams, GetUsersResponse, UserPermissions, GetLogsParams, GetLogsResponse } from '@/types/auth';
import { 
    mockSignInResponse, 
    mockUserResponse, 
    getMockUsersResponse, 
    getMockLogsResponse, 
    mockRefreshTokenResponse 
} from '@/mocks/authMocks';

export const authApi = {
    signIn: async (payload: SignInPayload): Promise<SignInResponse> => {
        // const response = await axios.post<SignInResponse>(
        //     '/auth/sign-in',
        //     payload
        // );
        
        // return response.data;
        
        // Simulate a successful sign-in response
        if (payload.username === 'admin' && payload.password === 'admin') {
            return mockSignInResponse;
        } else {
            throw new Error('Invalid credentials');
        }
    },
    getUser: async (): Promise<UserResponse> => {
        // const response = await axios.get<UserResponse>(
        //     '/auth/user/profile'
        // );
        
        // return response.data;

        return mockUserResponse;
    },
    getAllUsers: async (params: GetUsersParams): Promise<GetUsersResponse> => {
        // const response = await axios.get<GetUsersResponse>(
        //     '/auth/users',
        //     { params }
        // );

        // return response.data;
        
        // Simulate API call with mock data
        return getMockUsersResponse(params.page, params.limit, params.search);
    },
    saveUserPermissions: async (user: UserPermissions): Promise<void> => {
        // await axios.post('/auth/user/permissions', user);
        
        // Simulate successful API call
        // No return value needed as the function returns void
        console.log('Saving permissions for user:', user.username);
        return Promise.resolve();
    },
    getLogs: async (params: GetLogsParams): Promise<GetLogsResponse> => {
        // const response = await axios.get<GetLogsResponse>('/auth/user/logs', { params });
        // return response.data;
        
        // Simulate API call with mock data
        return getMockLogsResponse(params.page, params.limit, params.search);
    },
    refreshToken: async (): Promise<SignInResponse> => {
        // const response = await axios.post<SignInResponse>(
        //     '/auth/refresh'
        // );

        // return response.data;
        
        // Simulate successful token refresh
        return mockRefreshTokenResponse;
    },
    signOut: async (): Promise<void> => {
        try {
            // await axios.post<RefreshTokenResponse>(
            //     '/auth/logout'
            // );
            
            // Simulate successful logout
            console.log('User logged out successfully');
        } finally {
            // Even if the API call fails, we still want to clear the session locally
            removeAuthSession();
        }
    }
}; 