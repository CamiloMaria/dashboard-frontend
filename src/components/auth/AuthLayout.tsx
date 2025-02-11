import { Outlet } from '@tanstack/react-router';
import { TopBar } from './TopBar';

export function AuthLayout() {
    return (
        <div className="relative min-h-screen bg-background">
            <TopBar />
            <main>
                <Outlet />
            </main>
        </div>
    );
} 