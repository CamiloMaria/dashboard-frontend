import { createRoute } from '@tanstack/react-router';
import { appRoute } from './app';
import { ROUTES } from '@/constants/routes';
import { PermissionsPage } from '@/components/app/PermissionsPage';
import { requireAuth } from '@/lib/route-auth';

export const permissionsRoute = createRoute({
    getParentRoute: () => appRoute,
    path: ROUTES.PERMISSIONS,
    beforeLoad: () => requireAuth(ROUTES.PERMISSIONS),
    component: PermissionsPage,
}); 