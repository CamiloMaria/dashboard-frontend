import { Outlet } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/app/Sidebar';
import { TopBar } from '@/components/app/TopBar';
import { cn } from '@/lib/utils';
import { useNavigate } from '@tanstack/react-router';
import { isAuthenticated } from '@/lib/auth';
import { ROUTES } from '@/constants/routes';

export function AppLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate({ to: ROUTES.AUTH.LOGIN });
        }
    }, [navigate]);

    return (
        <div className="min-h-screen bg-background">
            <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

            <div className={cn(
                'flex flex-col transition-all duration-300 min-h-screen',
                sidebarOpen ? 'lg:ml-64' : 'lg:ml-20 lg:mr-8'
            )}>
                <TopBar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} isSidebarOpen={sidebarOpen} />

                <main className="flex-1">
                    <div className={cn(
                        'py-6 px-4 transition-all duration-300 mx-auto',
                        sidebarOpen ? 'max-w-[1400px]' : 'max-w-[1200px]'
                    )}>
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
} 