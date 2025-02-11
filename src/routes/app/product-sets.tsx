import { createRoute } from '@tanstack/react-router';
import { appRoute } from './app';
import { ProductSetsPage } from '@/components/app/ProductSetsPage';
import { ROUTES } from '@/constants/routes';

export const productSetsRoute = createRoute({
    getParentRoute: () => appRoute,
    path: ROUTES.INVENTORY.PRODUCT_SETS.LIST,
    component: ProductSetsPage,
}); 