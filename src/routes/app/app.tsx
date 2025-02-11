import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../__root';
import { AppLayout } from '@/components/app/AppLayout';

export const appRoute = createRoute({
    getParentRoute: () => rootRoute,
    id: 'app',
    component: AppLayout,
}); 