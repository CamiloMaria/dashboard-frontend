import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../__root';
import { AuthLayout } from '@/components/auth/AuthLayout';

export const authRoute = createRoute({
    getParentRoute: () => rootRoute,
    id: 'auth',
    component: AuthLayout,
}); 