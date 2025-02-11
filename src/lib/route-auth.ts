import { redirect } from '@tanstack/react-router';
import { getAuthToken } from './auth';
import { jwtDecode } from 'jwt-decode';
import { ROUTES } from '@/constants/routes';

export function hasAnyAllowedPages(): boolean {
    const token = getAuthToken();
    if (!token) return false;

    try {
        const decoded = jwtDecode<{ allowedPages?: string[] }>(token);
        return !!decoded.allowedPages?.length;
    } catch {
        return false;
    }
}

export function requireAuth(allowedPath: string) {
    const token = getAuthToken();
    if (!token) {
        throw redirect({ to: ROUTES.AUTH.LOGIN });
    }

    try {
        const decoded = jwtDecode<{ allowedPages?: string[] }>(token);
        if (!decoded.allowedPages?.length || !decoded.allowedPages.some(path => path === allowedPath)) {
            throw redirect({ to: '/' });
        }
    } catch {
        throw redirect({ to: ROUTES.AUTH.LOGIN });
    }
} 