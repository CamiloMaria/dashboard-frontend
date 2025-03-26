import { Outlet } from '@tanstack/react-router';
import { useState } from 'react';
import { Sidebar } from '@/components/app/Sidebar';
import { TopBar } from '@/components/app/TopBar';
import { cn } from '@/lib/utils';

export function AppLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-background">
            <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

            <div className={cn(
                'flex flex-col transition-all duration-300 min-h-screen',
                sidebarOpen ? 'lg:ml-64' : 'lg:ml-20 lg:mr-8'
            )}>
                <TopBar isSidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

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