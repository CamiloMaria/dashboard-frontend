import axios from 'axios';
import { ROUTES } from '@/constants/routes';
import { getAuthToken, removeAuthToken } from '@/lib/auth';
import { config } from '@/config/env';

// Create axios instance
const axiosInstance = axios.create({
    baseURL: config.apiUrl,
    headers: {
        Authorization: `Bearer ${getAuthToken()}`
    }
});

// Add response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear auth token
            removeAuthToken();

            // Force reload to trigger auth check and redirect
            window.location.href = ROUTES.AUTH.LOGIN;
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;