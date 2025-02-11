import { createRoute } from '@tanstack/react-router'
import { ProductsListPage } from '@/components/app/ProductsListPage'
import { ROUTES } from '@/constants/routes'
import { appRoute } from './app'

export const productsListRoute = createRoute({
    getParentRoute: () => appRoute,
    path: ROUTES.INVENTORY.PRODUCTS.LIST,
    component: ProductsListPage,
}) 