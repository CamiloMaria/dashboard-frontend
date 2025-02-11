import { createRoute } from '@tanstack/react-router'
import { NotFound } from '@/components/app/NotFound'
import { appRoute } from './app'

export const notFoundRoute = createRoute({
    getParentRoute: () => appRoute,
    path: '*',
    component: NotFound,
})