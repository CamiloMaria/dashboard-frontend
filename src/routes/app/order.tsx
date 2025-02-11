import { createRoute } from '@tanstack/react-router';
import { appRoute } from './app';
import { ROUTES } from '@/constants/routes';
import { OrdersPage } from '@/components/app/orders/OrdersPage';

export const orderRoute = createRoute({
    getParentRoute: () => appRoute,
    path: ROUTES.ORDERS,
    component: OrdersPage,
}); 