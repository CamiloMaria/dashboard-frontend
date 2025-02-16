import { redirect } from '@tanstack/react-router';
import { getAuthToken } from './auth';
import { jwtDecode } from 'jwt-decode';
import { BASE_PATH, ROUTES } from '@/constants/routes';

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
        const allowedPathWithoutBase = allowedPath.replace(BASE_PATH, '');
        if (!decoded.allowedPages?.length || !decoded.allowedPages.some(path => path === allowedPathWithoutBase)) {
            throw redirect({ to: ROUTES.AUTH.LOGIN });
        }
    } catch {
        throw redirect({ to: ROUTES.AUTH.LOGIN });
    }
} 