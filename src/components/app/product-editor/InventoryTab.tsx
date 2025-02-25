import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type Product } from '@/types/product';
import { ProductInventoryTable } from './ProductInventoryTable';
import { AlertCircle, ArrowDown, ArrowUp, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from '@/hooks/use-media-query';

interface StatCardProps {
    title: string;
    value: string;
    description: string;
    icon: React.ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    isMobile?: boolean;
}

function StatCard({ title, value, description, icon, trend, isMobile }: StatCardProps) {
    return (
        <Card className={cn(isMobile && "p-0.5")}>
            <CardHeader className={cn(
                "flex flex-row items-center justify-between space-y-0",
                isMobile ? "pb-1.5 pt-2 px-3" : "pb-2"
            )}>
                <CardTitle className={cn(
                    "font-medium",
                    isMobile ? "text-xs" : "text-sm"
                )}>
                    {title}
                </CardTitle>
                {icon}
            </CardHeader>
            <CardContent className={cn(isMobile && "p-3 pt-0")}>
                <div className={cn(
                    "font-bold",
                    isMobile ? "text-xl" : "text-2xl"
                )}>{value}</div>
                <div className={cn(
                    "flex items-center text-muted-foreground",
                    isMobile ? "text-[10px] mt-0.5" : "text-xs"
                )}>
                    {description}
                    {trend && (
                        <span
                            className={cn(
                                'ml-2 flex items-center gap-0.5',
                                trend.isPositive ? 'text-green-500' : 'text-red-500'
                            )}
                        >
                            {trend.isPositive ? (
                                <ArrowUp className={cn(isMobile ? "h-2.5 w-2.5" : "h-3 w-3")} />
                            ) : (
                                <ArrowDown className={cn(isMobile ? "h-2.5 w-2.5" : "h-3 w-3")} />
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
    const isMobile = useMediaQuery('(max-width: 640px)');
    const isTablet = useMediaQuery('(max-width: 1024px)');

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
        <div className="space-y-4 sm:space-y-6">
            <div className={cn(
                "grid gap-2 sm:gap-4",
                isMobile ? "grid-cols-2" :
                    isTablet ? "grid-cols-2 md:grid-cols-4" :
                        "grid-cols-2 md:grid-cols-4"
            )}>
                <StatCard
                    title={t('products.editor.form.inventory.stats.totalStock.title')}
                    value={totalStock.toString()}
                    description={t('products.editor.form.inventory.stats.totalStock.description')}
                    icon={<Package className={cn(isMobile ? "h-3 w-3" : "h-4 w-4", "text-muted-foreground")} />}
                    isMobile={isMobile}
                />
                <StatCard
                    title={t('products.editor.form.inventory.stats.lowStock.title')}
                    value={lowStockCount.toString()}
                    description={t('products.editor.form.inventory.stats.lowStock.description', { stock: product?.security_stock || 20 })}
                    icon={<AlertCircle className={cn(isMobile ? "h-3 w-3" : "h-4 w-4", "text-red-500")} />}
                    isMobile={isMobile}
                />
                <StatCard
                    title={t('products.editor.form.inventory.stats.activeListings.title')}
                    value={activeListings.toString()}
                    description={t('products.editor.form.inventory.stats.activeListings.description', { total: inventory.length })}
                    icon={<Package className={cn(isMobile ? "h-3 w-3" : "h-4 w-4", "text-green-500")} />}
                    isMobile={isMobile}
                />
                <StatCard
                    title={t('products.editor.form.inventory.stats.priceTrend.title')}
                    value={`${Math.abs(avgPriceChange).toFixed(1)}%`}
                    description={t('products.editor.form.inventory.stats.priceTrend.description')}
                    icon={avgPriceChange >= 0 ? (
                        <ArrowUp className={cn(isMobile ? "h-3 w-3" : "h-4 w-4", "text-green-500")} />
                    ) : (
                        <ArrowDown className={cn(isMobile ? "h-3 w-3" : "h-4 w-4", "text-red-500")} />
                    )}
                    trend={{
                        value: Number(Math.abs(avgPriceChange).toFixed(1)),
                        isPositive: avgPriceChange >= 0
                    }}
                    isMobile={isMobile}
                />
            </div>

            <Card>
                <CardHeader className={cn(
                    isMobile ? "px-3 py-2" : "pb-3"
                )}>
                    <CardTitle className={cn(isMobile && "text-base")}>
                        {t('products.editor.form.inventory.title')}
                    </CardTitle>
                </CardHeader>
                <CardContent className={cn(isMobile && "p-3")}>
                    <ProductInventoryTable
                        inventory={inventory}
                        securityStock={product?.security_stock || 10}
                    />
                </CardContent>
            </Card>
        </div>
    );
} 