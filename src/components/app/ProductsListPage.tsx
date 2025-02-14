import { Settings, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductsTable } from '@/components/app/products-table'
import { useNavigate } from '@tanstack/react-router'
import { productsNewRoute } from '@/routes/app/products-new'
import { useTranslation } from 'react-i18next'

export function ProductsListPage() {
    const navigate = useNavigate()
    const { t } = useTranslation()

    return (
        <>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight">{t('products.list.title')}</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {t('products.list.subtitle')}
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
                        {t('products.list.addProduct')}
                    </Button>
                </div>
            </div>
            <ProductsTable />
        </>
    )
} 