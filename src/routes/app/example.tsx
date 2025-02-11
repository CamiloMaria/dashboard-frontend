import { createRoute } from '@tanstack/react-router';
import { appRoute } from './app';
import { ROUTES } from '@/constants/routes';
import { ExamplePage } from '@/components/app/ExamplePage';

export const exampleRoute = createRoute({
    getParentRoute: () => appRoute,
    path: ROUTES.EXAMPLE,
    component: ExamplePage,
}); 