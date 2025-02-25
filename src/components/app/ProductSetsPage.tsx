import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductSetsTable } from './product-sets-table';
import { useNavigate } from '@tanstack/react-router';
import { createProductSetRoute } from '@/routes/app/create-product-set';
import { useTranslation } from 'react-i18next';

export function ProductSetsPage() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleCreateClick = () => {
        navigate({ to: createProductSetRoute.fullPath });
    };

    return (
        <div className="container py-4 sm:py-6 space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                <h1 className="text-2xl sm:text-3xl font-bold">{t('productSets.title')}</h1>
                <Button onClick={handleCreateClick} className="w-full sm:w-auto mt-2 sm:mt-0">
                    <Plus className="h-4 w-4 mr-2" />
                    {t('productSets.addSet')}
                </Button>
            </div>
            <ProductSetsTable />
        </div>
    );
}