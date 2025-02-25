import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { type Inventory } from '@/types/product';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    ChevronDown,
    ChevronUp,
    Search,
    Store,
    TrendingDown,
    TrendingUp,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from '@/hooks/use-media-query';

export interface ProductInventoryTableProps {
    inventory: Inventory[];
    securityStock?: number | undefined;
}

interface SortConfig {
    key: keyof Inventory | null;
    direction: 'asc' | 'desc';
}

interface StockIndicatorProps {
    stock: number;
    securityStock: number;
    isMobile?: boolean;
}

function StockIndicator({ stock, securityStock, isMobile }: StockIndicatorProps) {
    const getStockColor = (value: number, threshold: number) => {
        // If stock is below security stock, show red
        if (value < threshold) return 'bg-red-500';
        // If stock is within 20% above security stock, show yellow
        if (value < threshold * 1.2) return 'bg-yellow-500';
        // Otherwise show green
        return 'bg-green-500';
    };

    return (
        <div className={cn(
            "flex items-center gap-2",
            isMobile ? "min-w-0" : "min-w-[140px] gap-3"
        )}>
            <div className={cn(
                "bg-muted rounded-full overflow-hidden",
                isMobile ? "w-16 h-2" : "w-20 h-2.5"
            )}>
                <div
                    className={cn(
                        'h-full rounded-full transition-all',
                        getStockColor(stock, securityStock)
                    )}
                    style={{ width: `${Math.min(100, (stock / (securityStock * 2)) * 100)}%` }}
                />
            </div>
            <span className={cn(
                "font-medium tabular-nums",
                isMobile ? "text-xs w-8" : "text-sm w-12 text-right"
            )}>
                {stock}
            </span>
        </div>
    );
}

function PriceChange({ current, previous, isMobile }: { current: number; previous: number | null; isMobile?: boolean }) {
    if (!previous) return (
        <div className={cn(
            "flex items-center gap-2",
            isMobile ? "min-w-0" : "min-w-[160px] gap-3"
        )}>
            <span className="tabular-nums font-medium">${current.toFixed(2)}</span>
        </div>
    );

    const percentChange = ((current - previous) / previous) * 100;
    const isIncrease = percentChange > 0;

    return (
        <div className={cn(
            "flex items-center",
            isMobile ? "gap-1.5 flex-wrap" : "gap-3 min-w-[160px]"
        )}>
            <span className="tabular-nums font-medium">${current.toFixed(2)}</span>
            <Badge
                variant="outline"
                className={cn(
                    'flex items-center gap-1 justify-center',
                    isMobile ? "text-xs px-1.5 py-0.5 min-w-[60px]" : "min-w-[72px]",
                    isIncrease ? 'text-green-600' : 'text-red-600'
                )}
            >
                {isIncrease ? (
                    <TrendingUp className={cn(isMobile ? "h-2.5 w-2.5" : "h-3 w-3")} />
                ) : (
                    <TrendingDown className={cn(isMobile ? "h-2.5 w-2.5" : "h-3 w-3")} />
                )}
                {Math.abs(percentChange).toFixed(1)}%
            </Badge>
        </div>
    );
}

// Mobile card view for inventory items
function InventoryCard({
    item,
    securityStock,
    t
}: {
    item: Inventory;
    securityStock: number;
    t: (key: string, options?: Record<string, unknown>) => string;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 border rounded-md mb-3 bg-card"
        >
            <div className="flex items-center gap-2 mb-2">
                <Store className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="font-medium">{item.centro}</span>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3">
                <div>
                    <div className="text-xs text-muted-foreground mb-1">
                        {t('products.editor.form.inventory.columns.stock')}
                    </div>
                    <StockIndicator
                        stock={item.stock}
                        securityStock={securityStock}
                        isMobile={true}
                    />
                </div>

                <div>
                    <div className="text-xs text-muted-foreground mb-1">
                        {t('products.editor.form.inventory.columns.price')}
                    </div>
                    <PriceChange
                        current={item.price}
                        previous={item.compare_price ?? item.price}
                        isMobile={true}
                    />
                </div>

                <div>
                    <div className="text-xs text-muted-foreground mb-1">
                        {t('products.editor.form.inventory.columns.previousPrice')}
                    </div>
                    <span className="text-xs text-muted-foreground tabular-nums font-medium">
                        ${item.compare_price?.toFixed(2) ?? '0.00'}
                    </span>
                </div>

                <div>
                    <div className="text-xs text-muted-foreground mb-1">
                        {t('products.editor.form.inventory.columns.status')}
                    </div>
                    <Badge
                        variant={item.status === 1 ? 'default' : 'secondary'}
                        className="font-normal text-xs px-1.5 py-0.5 min-w-[60px] justify-center"
                    >
                        {item.status === 1 ? t('products.list.row.active') : t('products.list.row.inactive')}
                    </Badge>
                </div>
            </div>
        </motion.div>
    );
}

export function ProductInventoryTable({ inventory, securityStock = 10 }: ProductInventoryTableProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<SortConfig>({
        key: null,
        direction: 'asc',
    });
    const { t } = useTranslation();
    const isMobile = useMediaQuery('(max-width: 640px)');
    const isTablet = useMediaQuery('(max-width: 1024px)');

    const handleSort = (key: keyof Inventory) => {
        setSortConfig((current) => ({
            key,
            direction:
                current.key === key && current.direction === 'asc'
                    ? 'desc'
                    : 'asc',
        }));
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
    };

    const sortedAndFilteredInventory = useMemo(() => {
        let result = [...inventory];

        // Apply search filter
        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            result = result.filter((item) =>
                item.centro.toLowerCase().includes(lowerSearch)
            );
        }

        // Apply sorting
        if (sortConfig.key) {
            result.sort((a, b) => {
                const aValue = a[sortConfig.key!];
                const bValue = b[sortConfig.key!];
                const modifier = sortConfig.direction === 'asc' ? 1 : -1;

                if (typeof aValue === 'number' && typeof bValue === 'number') {
                    return (aValue - bValue) * modifier;
                }
                return String(aValue).localeCompare(String(bValue)) * modifier;
            });
        }

        return result;
    }, [inventory, searchTerm, sortConfig]);

    const SortIndicator = ({ columnKey }: { columnKey: keyof Inventory }) => {
        if (sortConfig.key !== columnKey) return null;
        return sortConfig.direction === 'asc' ? (
            <ChevronUp className="h-4 w-4" />
        ) : (
            <ChevronDown className="h-4 w-4" />
        );
    };

    // Empty state component
    const EmptyState = () => (
        <div className="flex flex-col items-center justify-center text-muted-foreground py-8">
            <Store className="h-8 w-8 mb-2" />
            <p className="text-sm">
                {t('products.editor.form.inventory.noInventory')}
            </p>
            <p className="text-xs">
                {t('products.editor.form.inventory.adjustSearch')}
            </p>
        </div>
    );

    return (
        <div className="space-y-4">
            <div className={cn(
                "relative",
                isMobile ? "w-full" : "max-w-sm"
            )}>
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder={t('products.editor.form.inventory.searchPlaceholder')}
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="pl-8"
                />
            </div>

            {/* Mobile view - card layout */}
            {isMobile ? (
                <div className="space-y-1">
                    <AnimatePresence>
                        {sortedAndFilteredInventory.length > 0 ? (
                            sortedAndFilteredInventory.map((item) => (
                                <InventoryCard
                                    key={item.id}
                                    item={item}
                                    securityStock={securityStock}
                                    t={t}
                                />
                            ))
                        ) : (
                            <div className="border rounded-md">
                                <EmptyState />
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            ) : (
                // Tablet and desktop view - table layout
                <div className="rounded-md border overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead
                                    className="cursor-pointer whitespace-nowrap"
                                    onClick={() => handleSort('centro')}
                                >
                                    <div className="flex items-center gap-2">
                                        {t('products.editor.form.inventory.columns.center')}
                                        <SortIndicator columnKey="centro" />
                                    </div>
                                </TableHead>
                                <TableHead
                                    className="cursor-pointer whitespace-nowrap"
                                    onClick={() => handleSort('stock')}
                                >
                                    <div className="flex items-center gap-2">
                                        {t('products.editor.form.inventory.columns.stock')}
                                        <SortIndicator columnKey="stock" />
                                    </div>
                                </TableHead>
                                <TableHead
                                    className="cursor-pointer whitespace-nowrap"
                                    onClick={() => handleSort('price')}
                                >
                                    <div className="flex items-center gap-2">
                                        {t('products.editor.form.inventory.columns.price')}
                                        <SortIndicator columnKey="price" />
                                    </div>
                                </TableHead>
                                <TableHead className={cn(
                                    "whitespace-nowrap",
                                    isTablet ? "pr-4" : "pr-8"
                                )}>
                                    {t('products.editor.form.inventory.columns.previousPrice')}
                                </TableHead>
                                <TableHead
                                    className={cn(
                                        "cursor-pointer whitespace-nowrap",
                                        isTablet ? "pl-4" : "pl-8"
                                    )}
                                    onClick={() => handleSort('status')}
                                >
                                    <div className="flex items-center gap-2">
                                        {t('products.editor.form.inventory.columns.status')}
                                        <SortIndicator columnKey="status" />
                                    </div>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <AnimatePresence>
                                {sortedAndFilteredInventory.map((inv) => (
                                    <motion.tr
                                        key={inv.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="group"
                                    >
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Store className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                                <span className="font-medium">{inv.centro}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <StockIndicator
                                                stock={inv.stock}
                                                securityStock={securityStock}
                                                isMobile={isTablet}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <PriceChange
                                                current={inv.price}
                                                previous={inv.compare_price ?? inv.price}
                                                isMobile={isTablet}
                                            />
                                        </TableCell>
                                        <TableCell className={cn(
                                            "text-muted-foreground tabular-nums font-medium",
                                            isTablet ? "pr-4" : "pr-8"
                                        )}>
                                            ${inv.compare_price?.toFixed(2) ?? '0.00'}
                                        </TableCell>
                                        <TableCell className={cn(
                                            isTablet ? "pl-4" : "pl-8"
                                        )}>
                                            <Badge
                                                variant={inv.status === 1 ? 'default' : 'secondary'}
                                                className={cn(
                                                    "font-normal justify-center",
                                                    isTablet ? "text-xs px-1.5 py-0.5 min-w-[60px]" : "min-w-[72px]"
                                                )}
                                            >
                                                {inv.status === 1 ? t('products.list.row.active') : t('products.list.row.inactive')}
                                            </Badge>
                                        </TableCell>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                            {sortedAndFilteredInventory.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="h-24 text-center"
                                    >
                                        <EmptyState />
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
} 