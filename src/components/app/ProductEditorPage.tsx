import { productEditorRoute } from "@/routes/app/product-editor"

import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { ProductEditor } from '@/components/app/product-editor'
import { productsListRoute } from "@/routes/app/products-list"

export function ProductEditorPage() {
    const { productId } = productEditorRoute.useParams()
    const navigate = useNavigate()
    const isNew = productId === 'new'

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight">
                        {isNew ? 'New Product' : 'Edit Product'}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {isNew ? 'Create a new product' : 'Update product information and settings'}
                    </p>
                </div>
                <Button variant="outline" onClick={() => navigate({ to: productsListRoute.fullPath })}>
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Back to Products
                </Button>
            </div>
            <ProductEditor productId={isNew ? undefined : productId} />
        </div>
    )
} 