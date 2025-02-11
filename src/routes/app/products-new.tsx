import { createRoute } from '@tanstack/react-router'
import { BulkProductCreator } from '@/components/app/product-creator/BulkProductCreator'
import { ROUTES } from '@/constants/routes'
import { appRoute } from './app'

export const productsNewRoute = createRoute({
    getParentRoute: () => appRoute,
    path: ROUTES.INVENTORY.PRODUCTS.NEW,
    component: BulkProductCreator,
})