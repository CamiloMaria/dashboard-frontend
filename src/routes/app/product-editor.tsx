import { createRoute } from '@tanstack/react-router'
import { ProductEditorPage } from '@/components/app/ProductEditorPage'
import { ROUTES } from '@/constants/routes'
import { appRoute } from './app'
import { requireAuth } from '@/lib/route-auth';

export const productEditorRoute = createRoute({
    getParentRoute: () => appRoute,
    path: ROUTES.INVENTORY.PRODUCTS.EDITOR,
    beforeLoad: () => requireAuth(ROUTES.INVENTORY.PRODUCTS.EDITOR),
    component: ProductEditorPage,
})