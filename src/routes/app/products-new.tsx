import { createRoute } from '@tanstack/react-router'
import { BulkProductCreator } from '@/components/app/product-creator/BulkProductCreator'
import { ROUTES } from '@/constants/routes'
import { appRoute } from './app'
import { requireAuth } from '@/lib/route-auth';

export const productsNewRoute = createRoute({
    getParentRoute: () => appRoute,
    path: ROUTES.INVENTORY.PRODUCTS.NEW,
    beforeLoad: async () => {
        return await requireAuth(ROUTES.INVENTORY.PRODUCTS.NEW);
    },
    component: BulkProductCreator,
})