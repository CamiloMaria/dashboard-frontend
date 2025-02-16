import axios from 'axios';
import { ROUTES } from '@/constants/routes';
import { removeAuthToken } from '@/lib/auth';
import { config } from '@/config/env';
import { getAuthToken } from './auth';

// Create axios instance
const axiosInstance = axios.create({
    baseURL: config.apiUrl,
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

// Add request interceptor
axiosInstance.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;