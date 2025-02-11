import { createRoute } from '@tanstack/react-router';
import { appRoute } from './app';
import { ROUTES } from '@/constants/routes';
import { CreateProductSetPage } from '@/components/app/product-sets/CreateProductSetPage';

export const createProductSetRoute = createRoute({
    getParentRoute: () => appRoute,
    path: ROUTES.INVENTORY.PRODUCT_SETS.NEW,
    component: CreateProductSetPage,
}); 