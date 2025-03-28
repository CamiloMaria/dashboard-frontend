import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { type Catalog } from '@/types/product';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    AlertCircle,
    ChevronDown,
    ChevronUp,
    Info,
    Search,
    Store,
    TrendingDown,
    TrendingUp,
} from 'lucide-react';
import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from '@/hooks/use-media-query';
import { DisableInventoryDialog } from './DisableInventoryDialog';
import { type DisableReason } from '@/constants/product';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';

export interface ProductInventoryTableProps {
    inventory: Catalog[];
    securityStock?: number | undefined;
    onInventoryUpdate?: (updatedInventory: Catalog[]) => void;
    readOnly?: boolean;
}

interface SortConfig {
    key: keyof Catalog | null;
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

function PriceChange({ current, previous, isMobile }: { current: number | null; previous: number | null; isMobile?: boolean }) {
    const currentPrice = Number(current) || 0;
    const previousPrice = Number(previous) || 0;

    if (!previous) return (
        <div className={cn(
            "flex items-center gap-2",
            isMobile ? "min-w-0" : "min-w-[160px] gap-3"
        )}>
            <span className="tabular-nums font-medium">${currentPrice.toFixed(2)}</span>
        </div>
    );

    // Handle case where current or previous could be null or zero
    let percentChange = 0;
    if (previousPrice !== 0) {
        percentChange = ((currentPrice - previousPrice) / previousPrice) * 100;
    } else if (currentPrice > 0) {
        // If previous price was zero but current is not, consider it a 100% increase
        percentChange = 100;
    }
    const isIncrease = percentChange > 0;

    return (
        <div className={cn(
            "flex items-center",
            isMobile ? "gap-1.5 flex-wrap" : "gap-3 min-w-[160px]"
        )}>
            <span className="tabular-nums font-medium">${currentPrice.toFixed(2)}</span>
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

interface StatusBadgeProps {
    status: number;
    statusComment?: string;
    onChange?: (newStatus: number) => void;
    isMobile?: boolean;
    readOnly?: boolean;
}

function StatusBadge({ status, statusComment, onChange, isMobile, readOnly = false }: StatusBadgeProps) {
    const { t } = useTranslation();
    const [isActive, setIsActive] = useState(status === 1);

    // Update local state when status prop changes
    useEffect(() => {
        setIsActive(status === 1);
    }, [status]);

    const handleStatusChange = (checked: boolean) => {
        if (!readOnly && onChange) {
            // Update local state for immediate feedback
            setIsActive(checked);
            // Then propagate change to parent
            onChange(checked ? 1 : 0);
        }
    };

    return (
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
                <Badge
                    variant={isActive ? 'default' : 'destructive'}
                    className={cn(
                        "font-normal justify-center",
                        isMobile ? "text-xs px-1.5 py-0.5 min-w-[60px]" : "min-w-[72px]",
                        !isActive && "bg-destructive/10 text-destructive"
                    )}
                >
                    {isActive ? t('products.list.row.active') : t('products.list.row.inactive')}
                </Badge>

                <Switch
                    checked={isActive}
                    onCheckedChange={handleStatusChange}
                    disabled={readOnly}
                    className={cn(
                        "data-[state=checked]:bg-green-600",
                        readOnly && "opacity-60 cursor-not-allowed"
                    )}
                />
            </div>

            {!isActive && statusComment && (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{t('products.inventory.status.reason')}: {statusComment}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}
        </div>
    );
}

// Mobile card view for inventory items
function InventoryCard({
    item,
    securityStock,
    t,
    onStatusChange,
    readOnly,
    recentlyChanged = []
}: {
    item: Catalog;
    securityStock: number;
    t: (key: string, options?: Record<string, unknown>) => string;
    onStatusChange?: (id: number, newStatus: number, comment?: string) => void;
    readOnly?: boolean;
    recentlyChanged?: number[];
}) {
    const handleStatusToggle = useCallback((newStatus: number) => {
        if (readOnly || !onStatusChange) return;

        // If changing to inactive, show dialog
        if (newStatus === 0) {
            onStatusChange(item.id, 0);
        } else {
            // If changing to active, toggle directly
            onStatusChange(item.id, 1);
        }
    }, [item.id, onStatusChange, readOnly]);

    // Use computed property instead of local state for consistency
    const isInactive = item.status === 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{
                opacity: 1,
                y: 0,
                backgroundColor: recentlyChanged.includes(item.id)
                    ? item.status === 1 ? 'rgba(132, 204, 22, 0.1)' : 'rgba(239, 68, 68, 0.1)'
                    : item.status === 0 ? 'rgba(0, 0, 0, 0.03)' : 'rgba(255, 255, 255, 1)'
            }}
            transition={{
                backgroundColor: { duration: 2 }
            }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
                "p-3 border rounded-md mb-3",
                isInactive
                    ? "bg-muted/50 border-muted text-muted-foreground"
                    : "bg-card",
                recentlyChanged.includes(item.id) && "shadow-sm"
            )}
        >
            <div className="flex items-center gap-2 mb-2">
                <Store className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className={cn(
                    "font-medium",
                    isInactive && "line-through opacity-70"
                )}>
                    {item.shop}
                </span>
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
                    <StatusBadge
                        key={`status-${item.id}-${item.status}`}
                        status={item.status}
                        statusComment={item.status_comment}
                        onChange={handleStatusToggle}
                        isMobile={true}
                        readOnly={readOnly}
                    />
                </div>
            </div>

            {item.status === 0 && item.status_comment && (
                <Alert variant="destructive" className="mt-3 py-2 bg-destructive/5 text-destructive border-destructive/20">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <AlertDescription className="text-xs mt-1">
                        <span className="font-medium block">
                            {t('products.editor.form.inventory.disable.disableReason')}
                        </span>
                        <span className="block mt-0.5">
                            {item.status_comment}
                        </span>
                    </AlertDescription>
                </Alert>
            )}
        </motion.div>
    );
}

export function ProductInventoryTable({
    inventory,
    securityStock = 10,
    onInventoryUpdate,
    readOnly = false
}: ProductInventoryTableProps) {
    // Store local copy of inventory to ensure we can track changes
    const [localInventory, setLocalInventory] = useState<Catalog[]>([]);
    const initialRenderRef = useRef(true);

    // Update local inventory when props change
    useEffect(() => {
        if (inventory && inventory.length > 0) {
            setLocalInventory(inventory);
        }
    }, [inventory]);

    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<SortConfig>({
        key: null,
        direction: 'asc',
    });
    const { t } = useTranslation();
    const isMobile = useMediaQuery('(max-width: 640px)');
    const isTablet = useMediaQuery('(max-width: 1024px)');

    // Dialog state
    const [showDisableDialog, setShowDisableDialog] = useState(false);
    const [selectedInventoryId, setSelectedInventoryId] = useState<number | null>(null);
    const [selectedShopName, setSelectedShopName] = useState('');

    // Add state to track recently changed items
    const [recentlyChanged, setRecentlyChanged] = useState<number[]>([]);

    // Reset the recently changed items after animation completes
    useEffect(() => {
        if (recentlyChanged.length > 0) {
            const timer = setTimeout(() => {
                setRecentlyChanged([]);
            }, 2000); // 2 seconds

            return () => clearTimeout(timer);
        }
    }, [recentlyChanged]);

    const handleSort = (key: keyof Catalog) => {
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

    const handleStatusClick = useCallback((id: number, shopName: string, newStatus: number) => {
        if (readOnly) return;

        // If changing to inactive, show dialog
        if (newStatus === 0) {
            setSelectedInventoryId(id);
            setSelectedShopName(shopName);
            setShowDisableDialog(true);
        } else {
            // If changing to active, update directly
            updateInventoryStatus(id, 1);
        }
    }, [readOnly]);

    const handleDisableConfirm = useCallback((reason: DisableReason) => {
        if (selectedInventoryId !== null) {
            updateInventoryStatus(selectedInventoryId, 0, reason);
            setShowDisableDialog(false);
            setSelectedInventoryId(null);
            setSelectedShopName('');
        }
    }, [selectedInventoryId]);

    const handleDisableCancel = useCallback(() => {
        setShowDisableDialog(false);
        setSelectedInventoryId(null);
        setSelectedShopName('');
    }, []);

    const updateInventoryStatus = useCallback((id: number, newStatus: number, comment?: string) => {
        // Create a new copy of the inventory to track our changes
        const updatedInventory = localInventory.map(item => {
            if (item.id === id) {
                // Apply the changes to this item
                return {
                    ...item,
                    status: newStatus,
                    status_comment: newStatus === 0 ? comment || '' : '',
                    manual_override: true,
                    status_changed_at: new Date(),
                    status_changed_by: 'user',
                    updated_at: new Date()
                };
            }
            return item;
        });

        // Update local state first for immediate UI feedback
        setLocalInventory(updatedInventory);

        // Mark this item as recently changed for animation
        setRecentlyChanged(prev => [...prev, id]);

        // Then propagate changes to parent
        if (onInventoryUpdate) {
            onInventoryUpdate(updatedInventory);
        }
    }, [localInventory, onInventoryUpdate]);

    const sortedAndFilteredInventory = useMemo(() => {
        let result = [...localInventory]; // Use local inventory instead of props

        // Apply search filter
        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            result = result.filter((item) =>
                item.shop.toLowerCase().includes(lowerSearch)
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
    }, [localInventory, searchTerm, sortConfig]);

    // Add debugging for UI updates
    useEffect(() => {
        if (initialRenderRef.current) {
            initialRenderRef.current = false;
            return;
        }
    }, [localInventory]);

    const SortIndicator = ({ columnKey }: { columnKey: keyof Catalog }) => {
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
                                    onStatusChange={
                                        !readOnly
                                            ? (id, newStatus) => handleStatusClick(id, item.shop, newStatus)
                                            : undefined
                                    }
                                    readOnly={readOnly}
                                    recentlyChanged={recentlyChanged}
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
                                    onClick={() => handleSort('shop')}
                                >
                                    <div className="flex items-center gap-2">
                                        {t('products.editor.form.inventory.columns.center')}
                                        <SortIndicator columnKey="shop" />
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
                                {sortedAndFilteredInventory.map((inv) => {
                                    const isInactive = inv.status === 0;
                                    const wasRecentlyChanged = recentlyChanged.includes(inv.id);

                                    return (
                                        <motion.tr
                                            key={inv.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                                backgroundColor: wasRecentlyChanged
                                                    ? inv.status === 1 ? 'rgba(132, 204, 22, 0.1)' : 'rgba(239, 68, 68, 0.1)'
                                                    : isInactive ? 'rgba(0, 0, 0, 0.03)' : 'rgba(255, 255, 255, 0)'
                                            }}
                                            transition={{
                                                backgroundColor: { duration: 2 }
                                            }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className={cn(
                                                "group",
                                                isInactive && "bg-muted/30",
                                                wasRecentlyChanged && "shadow-sm"
                                            )}
                                        >
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Store className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                                    <span className={cn(
                                                        "font-medium",
                                                        isInactive && "line-through opacity-70"
                                                    )}>
                                                        {inv.shop}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className={cn(isInactive && "opacity-70")}>
                                                <StockIndicator
                                                    stock={inv.stock}
                                                    securityStock={securityStock}
                                                    isMobile={isTablet}
                                                />
                                            </TableCell>
                                            <TableCell className={cn(isInactive && "opacity-70")}>
                                                <PriceChange
                                                    current={inv.price}
                                                    previous={inv.compare_price ?? inv.price}
                                                    isMobile={isTablet}
                                                />
                                            </TableCell>
                                            <TableCell className={cn(
                                                "text-muted-foreground tabular-nums font-medium",
                                                isTablet ? "pr-4" : "pr-8",
                                                isInactive && "opacity-70"
                                            )}>
                                                ${inv.compare_price?.toFixed(2) ?? '0.00'}
                                            </TableCell>
                                            <TableCell className={cn(
                                                isTablet ? "pl-4" : "pl-8"
                                            )}>
                                                <div className="space-y-2">
                                                    <StatusBadge
                                                        key={`status-${inv.id}-${inv.status}`}
                                                        status={inv.status}
                                                        statusComment={inv.status_comment}
                                                        onChange={(newStatus) => handleStatusClick(inv.id, inv.shop, newStatus)}
                                                        isMobile={isTablet}
                                                        readOnly={readOnly}
                                                    />

                                                    {isInactive && inv.status_comment && (
                                                        <Alert variant="destructive" className="py-2 bg-destructive/5 text-destructive border-destructive/20">
                                                            <AlertCircle className="h-3.5 w-3.5" />
                                                            <AlertDescription className="text-xs mt-1">
                                                                <span className="font-medium block">
                                                                    {t('products.editor.form.inventory.disable.disableReason')}
                                                                </span>
                                                                <span className="block mt-0.5">
                                                                    {inv.status_comment}
                                                                </span>
                                                            </AlertDescription>
                                                        </Alert>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </motion.tr>
                                    );
                                })}
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

            <DisableInventoryDialog
                open={showDisableDialog}
                shopName={selectedShopName}
                onConfirm={handleDisableConfirm}
                onCancel={handleDisableCancel}
            />
        </div>
    );
} 