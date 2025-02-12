import { createRoute } from '@tanstack/react-router';
import { appRoute } from './app';
import { ROUTES } from '@/constants/routes';
import { PermissionsPage } from '@/components/app/PermissionsPage';

export const permissionsRoute = createRoute({
    getParentRoute: () => appRoute,
    path: ROUTES.PERMISSIONS,
    component: PermissionsPage,
}); 