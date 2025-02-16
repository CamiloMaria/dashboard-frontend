import { createRoute } from '@tanstack/react-router'
import { NotFound } from '@/components/app/NotFound'
import { appRoute } from './app'
import { BASE_PATH } from '@/constants/routes'

export const notFoundRoute = createRoute({
    getParentRoute: () => appRoute,
    path: `${BASE_PATH}/*`,
    component: NotFound,
})