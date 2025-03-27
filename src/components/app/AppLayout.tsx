import { Outlet } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/app/Sidebar';
import { TopBar } from '@/components/app/TopBar';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';

export function AppLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Add media query hooks for responsive adjustments
    const isMobile = useMediaQuery('(max-width: 767px)');
    const isMediumTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');

    // Combined view for problematic sizes
    const isIntermediateView = isMediumTablet;

    // Auto-close sidebar on mobile/small screens when component mounts
    useEffect(() => {
        if (isMobile || isIntermediateView) {
            setSidebarOpen(false);
        } else {
            setSidebarOpen(true);
        }
    }, [isMobile, isIntermediateView]);

    // Handle responsive margin adjustments based on screen size and sidebar state
    const getContentMargins = () => {
        if (isMobile) return '';
        if (isMediumTablet) return sidebarOpen ? 'md:ml-52' : 'md:ml-12';
        return sidebarOpen ? 'lg:ml-64' : 'lg:ml-16 lg:mr-8';
    };

    const contentMargins = getContentMargins();

    return (
        <div className="min-h-screen bg-background">
            <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

            <div className={cn(
                'flex flex-col transition-all duration-300 min-h-screen',
                contentMargins
            )}>
                <TopBar isSidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

                <main className="flex-1">
                    <div className={cn(
                        'py-6 px-4 transition-all duration-300 mx-auto',
                        // Adjust max width based on sidebar state and viewport
                        isMobile ? 'max-w-full' :
                            isIntermediateView ? (sidebarOpen ? 'max-w-[90%]' : 'max-w-[95%]') :
                                sidebarOpen ? 'max-w-[1400px]' : 'max-w-[1200px]'
                    )}>
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
} 