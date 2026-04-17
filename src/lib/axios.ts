import axios from 'axios';
import { config } from '@/config/env';
// Auth disabled: no 401 redirect to login anymore.
// import { AxiosError } from 'axios';
// import { ROUTES } from '@/constants/routes';
// import { removeAuthSession } from '@/lib/auth';
// import { router } from '@/router';

// Create axios instance
const axiosInstance = axios.create({
    baseURL: config.apiUrl,
    // Ensure cookies are sent with requests
    withCredentials: true,
});

// Response interceptor for 401 handling is disabled while the login flow is
// removed. Requests that fail with 401 will simply reject, and the calling
// code is responsible for handling the error.
// axiosInstance.interceptors.response.use(
//     (response) => response,
//     async (error: AxiosError) => {
//         // Handle 401 Unauthorized errors (expired token)
//         if (error.response && error.response.status === 401) {
//             // Clear auth state
//             removeAuthSession();
//
//             // Avoid redirect loops - only redirect if not already on auth pages
//             const currentPath = window.location.pathname;
//             if (!currentPath.includes('/login') &&
//                 !currentPath.includes('/forgot-password') &&
//                 !currentPath.includes('/reset-password')) {
//                 router.navigate({ to: ROUTES.AUTH.LOGIN });
//             }
//         }
//         return Promise.reject(error);
//     }
// );

// Request interceptor no longer needed for token handling as cookies are sent automatically

export default axiosInstance;