import { OrdersTable } from './OrdersTable';
import { useTranslation } from 'react-i18next';

export function OrdersPage() {
    const { t } = useTranslation();

    return (
        <div className="container py-4 sm:py-6 space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">{t('orders.title')}</h1>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        {t('orders.subtitle')}
                    </p>
                </div>
            </div>

            <OrdersTable />
        </div>
    );
} 