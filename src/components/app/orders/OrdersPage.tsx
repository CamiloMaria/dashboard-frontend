import { OrdersTable } from './OrdersTable';
import { useTranslation } from 'react-i18next';

export function OrdersPage() {
    const { t } = useTranslation();

    return (
        <div className="container py-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">{t('orders.title')}</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {t('orders.subtitle')}
                    </p>
                </div>
            </div>
            <OrdersTable />
        </div>
    );
} 