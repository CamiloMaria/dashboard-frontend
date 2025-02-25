import { ProductsTable } from '@/components/app/products-table'
import { useTranslation } from 'react-i18next'

export function ProductsListPage() {
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
            </div>
            <ProductsTable />
        </>
    )
} 