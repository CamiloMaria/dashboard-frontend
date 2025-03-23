import { createRoute } from '@tanstack/react-router';
import { appRoute } from './app';
import { ROUTES } from '@/constants/routes';
import { OrdersPage } from '@/components/app/orders/OrdersPage';
import { requireAuth } from '@/lib/route-auth';

export const orderRoute = createRoute({
    getParentRoute: () => appRoute,
    path: ROUTES.ORDERS,
    beforeLoad: async () => {
        return await requireAuth(ROUTES.ORDERS);
    },
    component: OrdersPage,
}); 