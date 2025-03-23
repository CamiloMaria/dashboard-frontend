import { createRoute } from "@tanstack/react-router";
import { LogsPage } from "@/components/app/logs/LogsPage";
import { ROUTES } from "@/constants/routes";
import { appRoute } from "./app";
import { requireAuth } from "@/lib/route-auth";

export const logsRoute = createRoute({
    getParentRoute: () => appRoute,
    path: ROUTES.LOGS,
    beforeLoad: async () => {
        return await requireAuth(ROUTES.LOGS);
    },
    component: LogsPage,
}); 