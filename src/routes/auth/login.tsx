import { createRoute } from '@tanstack/react-router';
import { authRoute } from './auth';
import { LoginPage } from '@/components/auth/LoginPage';
import { ROUTES } from '@/constants/routes';

export const loginRoute = createRoute({
    getParentRoute: () => authRoute,
    path: ROUTES.AUTH.LOGIN,
    component: LoginPage,
}); 