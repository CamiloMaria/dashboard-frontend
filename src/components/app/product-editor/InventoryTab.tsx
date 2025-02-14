import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type Product } from '@/types/product';
import { ProductInventoryTable } from './ProductInventoryTable';
import { AlertCircle, ArrowDown, ArrowUp, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface StatCardProps {
    title: string;
    value: string;
    description: string;
    icon: React.ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

function StatCard({ title, value, description, icon, trend }: StatCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {title}
                </CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                    {description}
                    {trend && (
                        <span
                            className={cn(
                                'ml-2 flex items-center gap-0.5',
                                trend.isPositive ? 'text-green-500' : 'text-red-500'
                            )}
                        >
                            {trend.isPositive ? (
                                <ArrowUp className="h-3 w-3" />
                            ) : (
                                <ArrowDown className="h-3 w-3" />
                            )}
                            {trend.value}%
                        </span>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

interface InventoryTabProps {
    product: Product | undefined;
}

export function InventoryTab({ product }: InventoryTabProps) {
    const inventory = product?.inventory || [];
    const { t } = useTranslation();

    // Calculate inventory statistics
    const totalStock = inventory.reduce((sum, inv) => sum + inv.stock, 0);
    const lowStockCount = inventory.filter(inv => inv.stock < (product?.security_stock || 20)).length;
    const activeListings = inventory.filter(inv => inv.status === 1).length;

    // Calculate average price change
    const priceChanges = inventory
        .filter(inv => inv.compare_price && inv.compare_price > 0)
        .map(inv => ((inv.price - inv.compare_price!) / inv.compare_price!) * 100);

    const avgPriceChange = priceChanges.length
        ? priceChanges.reduce((sum, change) => sum + change, 0) / priceChanges.length
        : 0;

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title={t('products.editor.form.inventory.stats.totalStock.title')}
                    value={totalStock.toString()}
                    description={t('products.editor.form.inventory.stats.totalStock.description')}
                    icon={<Package className="h-4 w-4 text-muted-foreground" />}
                />
                <StatCard
                    title={t('products.editor.form.inventory.stats.lowStock.title')}
                    value={lowStockCount.toString()}
                    description={t('products.editor.form.inventory.stats.lowStock.description', { stock: product?.security_stock || 20 })}
                    icon={<AlertCircle className="h-4 w-4 text-red-500" />}
                />
                <StatCard
                    title={t('products.editor.form.inventory.stats.activeListings.title')}
                    value={activeListings.toString()}
                    description={t('products.editor.form.inventory.stats.activeListings.description', { total: inventory.length })}
                    icon={<Package className="h-4 w-4 text-green-500" />}
                />
                <StatCard
                    title={t('products.editor.form.inventory.stats.priceTrend.title')}
                    value={`${Math.abs(avgPriceChange).toFixed(1)}%`}
                    description={t('products.editor.form.inventory.stats.priceTrend.description')}
                    icon={avgPriceChange >= 0 ? (
                        <ArrowUp className="h-4 w-4 text-green-500" />
                    ) : (
                        <ArrowDown className="h-4 w-4 text-red-500" />
                    )}
                    trend={{
                        value: Number(Math.abs(avgPriceChange).toFixed(1)),
                        isPositive: avgPriceChange >= 0
                    }}
                />
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle>{t('products.editor.form.inventory.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <ProductInventoryTable
                        inventory={inventory}
                        securityStock={product?.security_stock || 10}
                    />
                </CardContent>
            </Card>
        </div>
    );
} 