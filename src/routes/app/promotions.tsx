import { createRoute } from '@tanstack/react-router';
import { appRoute } from './app';
import { ROUTES } from '@/constants/routes';
import { PromotionsPage } from '@/components/app/PromotionsPage';

export const promotionsRoute = createRoute({
    getParentRoute: () => appRoute,
    path: ROUTES.INVENTORY.PROMOTIONS,
    component: PromotionsPage,
});