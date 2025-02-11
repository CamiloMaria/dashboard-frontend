import { Outlet } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { useMemo } from 'react'

export function RootLayout() {
    const queryClient = useMemo(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 1000 * 60 * 5, // 5 minutes
                gcTime: 1000 * 60 * 60, // 1 hour
                refetchOnWindowFocus: true,
                refetchOnReconnect: true,
                retry: 3,
            },
        },
    }), [])

    return (
        <QueryClientProvider client={queryClient}>
            <Outlet />
            <ReactQueryDevtools />
            {process.env.NODE_ENV === 'development' && <TanStackRouterDevtools />}
        </QueryClientProvider>
    )
} 