import { getAuthToken } from '@/lib/auth';

export const API_URL = 'http://localhost:3000/api';

export const getHeaders = () => ({
  Authorization: `Bearer ${getAuthToken()}`
}); 