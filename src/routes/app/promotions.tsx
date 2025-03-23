import { createRoute } from '@tanstack/react-router';
import { appRoute } from './app';
import { ROUTES } from '@/constants/routes';
import { PromotionsPage } from '@/components/app/PromotionsPage';
import { requireAuth } from '@/lib/route-auth';

export const promotionsRoute = createRoute({
    getParentRoute: () => appRoute,
    path: ROUTES.INVENTORY.PROMOTIONS,
    beforeLoad: async () => {
        return await requireAuth(ROUTES.INVENTORY.PROMOTIONS);
    },
    component: PromotionsPage,
});