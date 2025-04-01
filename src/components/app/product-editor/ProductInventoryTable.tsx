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
    CheckCircle,
    XCircle,
    InfoIcon,
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
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export interface ProductInventoryTableProps {
    inventory: Catalog[];
    securityStock?: number | undefined;
    onInventoryUpdate?: (updatedInventory: Catalog[], changedIds?: number[]) => void;
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
    pendingStatusChange?: boolean;
    manualOverride?: boolean;
    onManualOverrideChange?: (manualOverride: boolean) => void;
}

function StatusBadge({
    status,
    statusComment,
    onChange,
    isMobile,
    readOnly = false,
    pendingStatusChange = false,
    manualOverride = false,
    onManualOverrideChange
}: StatusBadgeProps) {
    const { t } = useTranslation();
    // Track the actual status from props separately from visual state
    const [isActive, setIsActive] = useState(status === 1);

    // Update local state when status prop changes
    useEffect(() => {
        setIsActive(status === 1);
    }, [status]);

    // Handle status toggle
    const handleStatusChange = (checked: boolean) => {
        if (readOnly || !onChange) return;

        // Only update local state immediately if activating (not deactivating)
        // For deactivation, we'll wait for confirmation
        if (checked) {
            setIsActive(true);
            onChange(1);
        } else {
            // For deactivation, don't update local state yet, just propagate to parent
            // The parent will show the confirmation dialog
            onChange(0);
            // Don't set isActive to false here - wait for parent to update status
        }
    };

    // Handle manual override toggle
    const handleManualOverrideChange = (checked: boolean) => {
        if (readOnly || !onManualOverrideChange) return;
        onManualOverrideChange(checked);
    };

    // Determine if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const animationDuration = prefersReducedMotion ? 0 : 0.3;

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2">
                <motion.div
                    initial={{ opacity: 1 }}
                    animate={{
                        opacity: [1, 0.8, 1],
                        scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: animationDuration, times: [0, 0.5, 1] }}
                    key={`badge-${isActive}-${pendingStatusChange}`}
                    className="flex items-center"
                >
                    <Badge
                        variant={isActive ? 'default' : 'destructive'}
                        className={cn(
                            "font-normal justify-center flex items-center gap-1",
                            isMobile ? "text-xs px-1.5 py-0.5 min-w-[64px]" : "min-w-[80px] py-1",
                            isActive ? "bg-green-600 hover:bg-green-700" : "bg-destructive/10 text-destructive hover:bg-destructive/20",
                            pendingStatusChange && "opacity-60"
                        )}
                    >
                        {isActive ? (
                            <CheckCircle className={cn(isMobile ? "h-3 w-3" : "h-3.5 w-3.5")} />
                        ) : (
                            <XCircle className={cn(isMobile ? "h-3 w-3" : "h-3.5 w-3.5")} />
                        )}
                        {isActive ? t('products.list.row.active') : t('products.list.row.inactive')}
                    </Badge>
                </motion.div>

                <Switch
                    checked={isActive}
                    onCheckedChange={handleStatusChange}
                    disabled={readOnly || pendingStatusChange}
                    className={cn(
                        "data-[state=checked]:bg-green-600 data-[state=checked]:hover:bg-green-700",
                        "transition-colors duration-200",
                        (readOnly || pendingStatusChange) && "opacity-60 cursor-not-allowed"
                    )}
                    aria-label={isActive ? t('products.list.row.setInactive') : t('products.list.row.setActive')}
                />

                {/* {manualOverride && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="flex items-center">
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            "bg-amber-50 text-amber-700 border-amber-200 px-1 h-5",
                                            isMobile ? "ml-0" : "ml-1"
                                        )}
                                    >
                                        <span className="sr-only">Manual Override</span>
                                        <InfoIcon className="h-3 w-3" />
                                    </Badge>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="text-xs max-w-[200px]">
                                    This inventory status has been manually overridden and won't be automatically updated by the system.
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )} */}
            </div>

            {onManualOverrideChange && (
                <div className="flex items-center gap-1.5 mt-1 sm:mt-0">
                    <Checkbox
                        id={`manual-override-${status}`}
                        checked={manualOverride}
                        onCheckedChange={handleManualOverrideChange}
                        disabled={readOnly || pendingStatusChange}
                        className="h-3.5 w-3.5"
                    />
                    <Label
                        htmlFor={`manual-override-${status}`}
                        className="text-xs text-muted-foreground cursor-pointer"
                    >
                        Manual Override
                    </Label>
                </div>
            )}

            {!isActive && statusComment && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: animationDuration }}
                    className={cn(
                        "flex items-start gap-1.5 max-w-[300px] text-sm",
                        isMobile ? "ml-0 mt-1" : "mt-0"
                    )}
                >
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="flex items-center gap-1.5 cursor-help py-1 px-2 rounded hover:bg-muted/50 border border-dashed border-muted-foreground/30">
                                    <Info className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                                    <span className="text-xs text-muted-foreground line-clamp-1">
                                        {statusComment.length > 20 ? `${statusComment.substring(0, 20)}...` : statusComment}
                                    </span>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="max-w-[300px]">
                                <div className="space-y-1">
                                    <p className="font-medium text-sm">{t('products.inventory.status.reason')}:</p>
                                    <p className="text-sm">{statusComment}</p>
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </motion.div>
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
    onManualOverrideChange,
    readOnly,
    recentlyChanged = [],
    pendingStatusChange = false
}: {
    item: Catalog;
    securityStock: number;
    t: (key: string, options?: Record<string, unknown>) => string;
    onStatusChange?: (id: number, newStatus: number, comment?: string) => void;
    onManualOverrideChange?: (manualOverride: boolean) => void;
    readOnly?: boolean;
    recentlyChanged?: number[];
    pendingStatusChange?: boolean;
}) {
    const handleStatusToggle = useCallback((newStatus: number) => {
        if (readOnly || !onStatusChange || pendingStatusChange) return;

        // If changing to inactive, show dialog
        if (newStatus === 0) {
            onStatusChange(item.id, 0);
        } else {
            // If changing to active, toggle directly
            onStatusChange(item.id, 1);
        }
    }, [item.id, onStatusChange, readOnly, pendingStatusChange]);

    const handleManualOverrideChange = useCallback((checked: boolean) => {
        if (readOnly || !onManualOverrideChange || pendingStatusChange) return;
        onManualOverrideChange(checked);
    }, [onManualOverrideChange, readOnly, pendingStatusChange]);

    // Use computed property instead of local state for consistency
    const isInactive = item.status === 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{
                opacity: pendingStatusChange ? 0.8 : 1,
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
                recentlyChanged.includes(item.id) && "shadow-sm",
                pendingStatusChange && "opacity-80"
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

                {item.manual_override && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Badge
                                    variant="outline"
                                    className="bg-amber-50 text-amber-700 border-amber-200 px-1 h-5"
                                >
                                    <span className="sr-only">Manual Override</span>
                                    <InfoIcon className="h-3 w-3" />
                                </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="text-xs max-w-[200px]">
                                    This inventory status has been manually overridden and won't be automatically updated by the system.
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
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
                        key={`status-${item.id}-${item.status}-${pendingStatusChange ? 'pending' : 'normal'}`}
                        status={item.status}
                        statusComment={item.status_comment || ''}
                        onChange={handleStatusToggle}
                        manualOverride={item.manual_override}
                        onManualOverrideChange={onManualOverrideChange
                            ? handleManualOverrideChange
                            : undefined
                        }
                        isMobile={true}
                        readOnly={readOnly}
                        pendingStatusChange={pendingStatusChange}
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

    // Add a new state to track changed items regardless of manual override status
    const [changedItemIds, setChangedItemIds] = useState<number[]>([]);

    // Update local inventory when props change
    useEffect(() => {
        if (inventory && inventory.length > 0) {
            setLocalInventory(inventory);
            // Reset changed items tracking on inventory update from props
            setChangedItemIds([]);
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
    // Add a state to track pending status changes
    const [pendingStatusChange, setPendingStatusChange] = useState<boolean>(false);

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

    // Define updateInventoryStatus function
    const updateInventoryStatus = useCallback((id: number, newStatus: number, comment?: string, manualOverride: boolean = true) => {
        // Create a new copy of the inventory to track our changes
        const updatedInventory = localInventory.map(item => {
            if (item.id === id) {
                // Apply the changes to this item
                return {
                    ...item,
                    status: newStatus,
                    status_comment: newStatus === 0 ? comment || '' : '',
                    manual_override: manualOverride,
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

        // Track this item as changed regardless of manual override setting
        // Use functional state update to ensure we work with the latest state
        setChangedItemIds(prevIds => {
            // Make sure we don't add duplicates
            if (!prevIds.includes(id)) {
                return [...prevIds, id];
            }
            return prevIds;
        });

        // Then propagate changes to parent
        if (onInventoryUpdate) {
            // Get latest changed IDs including the current one
            // We don't use changedItemIds directly as it might not have the latest value due to closures
            const updatedChangedIds = changedItemIds.includes(id)
                ? changedItemIds
                : [...changedItemIds, id];

            onInventoryUpdate(updatedInventory, updatedChangedIds);
        }
    }, [localInventory, onInventoryUpdate, changedItemIds]);

    // Add function to handle manual override toggle
    const handleManualOverrideToggle = useCallback((id: number, manualOverride: boolean) => {
        if (readOnly) return;

        // Update the item with the new manual override setting
        // But keep the other properties the same
        const updatedInventory = localInventory.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    manual_override: manualOverride,
                    status_changed_at: new Date(),
                    status_changed_by: 'user',
                    updated_at: new Date()
                };
            }
            return item;
        });

        // Update local state
        setLocalInventory(updatedInventory);

        // Mark as recently changed for animation
        setRecentlyChanged(prev => [...prev, id]);

        // Track this item as changed regardless of manual override setting
        // Use functional state update to ensure we work with the latest state
        setChangedItemIds(prevIds => {
            if (!prevIds.includes(id)) {
                return [...prevIds, id];
            }
            return prevIds;
        });

        // Propagate to parent
        if (onInventoryUpdate) {
            // Use functional reference to get latest state
            const updatedChangedIds = changedItemIds.includes(id)
                ? changedItemIds
                : [...changedItemIds, id];

            onInventoryUpdate(updatedInventory, updatedChangedIds);
        }
    }, [localInventory, onInventoryUpdate, readOnly, changedItemIds]);

    const handleStatusClick = useCallback((id: number, shopName: string, newStatus: number) => {
        if (readOnly) return;

        // If changing to inactive, show dialog
        if (newStatus === 0) {
            setSelectedInventoryId(id);
            setSelectedShopName(shopName);
            setPendingStatusChange(true); // Mark that we have a pending change
            setShowDisableDialog(true);
        } else {
            // If changing to active, update directly
            updateInventoryStatus(id, 1);
        }
    }, [readOnly, updateInventoryStatus]);

    const handleDisableConfirm = useCallback((reason: DisableReason, manualOverride: boolean = true) => {
        if (selectedInventoryId !== null) {
            updateInventoryStatus(selectedInventoryId, 0, reason, manualOverride);
            setShowDisableDialog(false);
            setSelectedInventoryId(null);
            setSelectedShopName('');
            setPendingStatusChange(false); // Clear pending status
        }
    }, [selectedInventoryId, updateInventoryStatus]);

    const handleDisableCancel = useCallback(() => {
        // On cancel, do NOT update the inventory status
        setShowDisableDialog(false);
        setSelectedInventoryId(null);
        setSelectedShopName('');
        setPendingStatusChange(false); // Clear pending status
        // No need to call updateInventoryStatus here
    }, []);

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
                                    onManualOverrideChange={
                                        !readOnly
                                            ? (manualOverride) => handleManualOverrideToggle(item.id, manualOverride)
                                            : undefined
                                    }
                                    readOnly={readOnly}
                                    recentlyChanged={recentlyChanged}
                                    pendingStatusChange={pendingStatusChange && selectedInventoryId === item.id}
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
                                    const isPendingChange = pendingStatusChange && selectedInventoryId === inv.id;

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
                                                wasRecentlyChanged && "shadow-sm",
                                                isPendingChange && "opacity-80"
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
                                                <StatusBadge
                                                    key={`status-${inv.id}-${inv.status}-${isPendingChange ? 'pending' : 'normal'}`}
                                                    status={inv.status}
                                                    statusComment={inv.status_comment || ''}
                                                    onChange={(newStatus) => handleStatusClick(inv.id, inv.shop, newStatus)}
                                                    manualOverride={inv.manual_override}
                                                    onManualOverrideChange={!readOnly
                                                        ? (manualOverride) => handleManualOverrideToggle(inv.id, manualOverride)
                                                        : undefined
                                                    }
                                                    isMobile={isTablet}
                                                    readOnly={readOnly}
                                                    pendingStatusChange={isPendingChange}
                                                />
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