import { createRoute, redirect } from '@tanstack/react-router';
import { ROUTES } from '@/constants/routes';
import { appRoute } from './app';

// Redirect the root path ("/") to the products list, since there is no
// dedicated home page in this dashboard.
export const indexRedirectRoute = createRoute({
    getParentRoute: () => appRoute,
    path: '/',
    beforeLoad: () => {
        throw redirect({ to: ROUTES.INVENTORY.PRODUCTS.LIST });
    },
    component: () => null,
});
