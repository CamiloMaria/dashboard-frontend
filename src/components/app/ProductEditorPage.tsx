import { productEditorRoute } from "@/routes/app/product-editor"

import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { ProductEditor } from '@/components/app/product-editor'
import { productsListRoute } from "@/routes/app/products-list"
import { useTranslation } from 'react-i18next'

export function ProductEditorPage() {
    const { productId } = productEditorRoute.useParams()
    const navigate = useNavigate()
    const { t } = useTranslation()
    const isNew = productId === 'new'

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight">
                        {t(isNew ? 'products.editor.new.title' : 'products.editor.edit.title')}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {t(isNew ? 'products.editor.new.subtitle' : 'products.editor.edit.subtitle')}
                    </p>
                </div>
                <Button variant="outline" onClick={() => navigate({ to: productsListRoute.fullPath })}>
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    {t('products.editor.backToProducts')}
                </Button>
            </div>
            <ProductEditor productId={isNew ? undefined : productId} />
        </div>
    )
} 