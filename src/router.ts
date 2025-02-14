import { createRouter } from '@tanstack/react-router'
import { rootRoute } from './routes/__root'
import { notFoundRoute } from './routes/app/not-found'
import { authRoute } from './routes/auth/auth'
import { loginRoute } from './routes/auth/login'
import { appRoute } from './routes/app/app'
import { productsListRoute } from './routes/app/products-list'
import { productEditorRoute } from './routes/app/product-editor'
import { productsNewRoute } from './routes/app/products-new'
import { productSetsRoute } from './routes/app/product-sets'
import { createProductSetRoute } from './routes/app/create-product-set'
import { promotionsRoute } from './routes/app/promotions'
import { orderRoute } from './routes/app/order'
import { permissionsRoute } from './routes/app/permissions'
import { logsRoute } from './routes/app/logs'

const routeTree = rootRoute.addChildren([
    authRoute.addChildren([
        loginRoute,
    ]),
    appRoute.addChildren([
        productsListRoute,
        productEditorRoute,
        productsNewRoute,
        productSetsRoute,
        createProductSetRoute,
        promotionsRoute,
        orderRoute,
        permissionsRoute,
        logsRoute,
    ]),
    notFoundRoute,
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
} 