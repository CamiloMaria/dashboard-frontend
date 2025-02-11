import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductSetsTable } from './product-sets-table';
import { useNavigate } from '@tanstack/react-router';
import { createProductSetRoute } from '@/routes/app/create-product-set';

export function ProductSetsPage() {
    const navigate = useNavigate();

    const handleCreateClick = () => {
        navigate({ to: createProductSetRoute.fullPath });
    };

    return (
        <div className="container py-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Product Sets</h1>
                <Button onClick={handleCreateClick}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Set
                </Button>
            </div>
            <ProductSetsTable />
        </div>
    );
}