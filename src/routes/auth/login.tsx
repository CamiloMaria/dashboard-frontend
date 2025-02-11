import { createRoute } from '@tanstack/react-router';
import { authRoute } from './auth';
import { LoginPage } from '@/components/auth/LoginPage';

export const loginRoute = createRoute({
    getParentRoute: () => authRoute,
    path: '/login',
    component: LoginPage,
}); 