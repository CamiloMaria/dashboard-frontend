import axios, { AxiosError } from 'axios';
import { config } from '@/config/env';

// Create axios instance
const axiosInstance = axios.create({
    baseURL: config.apiUrl,
    // Ensure cookies are sent with requests
    withCredentials: true,
});

// Add response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Request interceptor no longer needed for token handling as cookies are sent automatically

export default axiosInstance;