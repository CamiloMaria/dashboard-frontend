import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import { ROUTES } from '@/constants/routes'

export function NotFound() {
    const navigate = useNavigate()

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-6">
            <div className="space-y-2 text-center">
                <h1 className="text-4xl font-bold tracking-tighter">404 - Page Not Found</h1>
                <p className="text-muted-foreground">
                    The page you're looking for doesn't exist or has been moved.
                </p>
            </div>

            <Button onClick={() => navigate({ to: ROUTES.INVENTORY.PRODUCTS.LIST })} variant="outline">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Home
            </Button>
        </div>
    )
} 