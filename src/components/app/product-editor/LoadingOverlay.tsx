import { Loader2 } from 'lucide-react';

export interface LoadingOverlayProps {
    isLoading: boolean;
    message: string;
}

export function LoadingOverlay({ isLoading, message }: LoadingOverlayProps) {
    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 bg-background/50 flex items-center justify-center z-50">
            <div className="bg-background p-6 rounded-lg shadow-lg flex items-center gap-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="text-lg font-medium">{message}</p>
            </div>
        </div>
    );
} 