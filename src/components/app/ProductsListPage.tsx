import { Settings, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductsTable } from '@/components/app/products-table'
import { useNavigate } from '@tanstack/react-router'
import { productsNewRoute } from '@/routes/app/products-new'

export function ProductsListPage() {
    const navigate = useNavigate()

    return (
        <>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight">Products</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage your product inventory and settings
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button size="icon" variant="outline" className="h-9 w-9">
                        <Settings className="h-4 w-4" />
                    </Button>
                    <Button
                        className="h-9"
                        onClick={() => navigate({ to: productsNewRoute.fullPath })}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                    </Button>
                </div>
            </div>
            <ProductsTable />
        </>
    )
} 