import { createRoute } from '@tanstack/react-router'
import { NotFound } from '@/components/app/NotFound'
import { appRoute } from './app'
import { ROUTES } from '@/constants/routes'

export const notFoundRoute = createRoute({
    getParentRoute: () => appRoute,
    path: `${ROUTES.DASHBOARD}/*`,
    component: NotFound,
})