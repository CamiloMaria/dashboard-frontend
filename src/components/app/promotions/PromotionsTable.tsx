import { useState, useCallback, useTransition } from 'react';
import {
    Download,
    Loader2,
    Package,
    Search,
    ArrowUpDown,
    DollarSign,
    Calendar,
    Store,
    Barcode,
    Tag,
    Hash
} from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebounce } from '@/hooks/use-debounce';
import { PaginationControls } from '../products-table/PaginationControls';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { promotionsApi } from '@/api/promotions';
import { Promotion } from '@/types/promotion';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { promotionKeys } from '@/api/query-keys';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from '@/hooks/use-media-query';

export function PromotionsTable() {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [, startTransition] = useTransition();
    const { t } = useTranslation();

    // Media query hooks for responsive design
    const isDesktop = useMediaQuery("(min-width: 1024px)");
    const isTablet = useMediaQuery("(min-width: 768px)");

    const debouncedSearch = useDebounce(searchTerm);

    const { data, isLoading, isError, isFetching } = useQuery({
        queryKey: promotionKeys.list({ page: currentPage, limit: itemsPerPage, search: debouncedSearch }),
        queryFn: () => promotionsApi.getPromotions({ page: currentPage, limit: itemsPerPage, search: debouncedSearch }),
        placeholderData: keepPreviousData,
        staleTime: 5000,
    });

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (value !== searchTerm) {
            setCurrentPage(1);
            setItemsPerPage(10);
        }
    };

    const handlePageChange = useCallback((newPage: number) => {
        startTransition(() => {
            setCurrentPage(newPage);
        });
    }, []);

    const handleItemsPerPageChange = useCallback((newItemsPerPage: number) => {
        startTransition(() => {
            setItemsPerPage(newItemsPerPage);
            setCurrentPage(1);
        });
    }, []);

    const exportToCSV = (data: Promotion[]) => {
        const csvContent = [
            [
                t('promotions.columns.promoNumber'),
                t('promotions.columns.sku'),
                t('promotions.columns.material'),
                t('promotions.columns.shop'),
                t('promotions.columns.price'),
                t('promotions.columns.comparePrice'),
                t('promotions.columns.status'),
                t('promotions.columns.createdAt')
            ],
            ...data.map(promo => [
                promo.no_promo,
                promo.sku,
                promo.matnr,
                promo.shop,
                promo.price,
                promo.compare_price,
                promo.status ? t('common.active') : t('common.inactive'),
                new Date(promo.created_at).toLocaleDateString()
            ])
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'promotions.csv';
        a.click();
    };

    // Mobile card view for each promotion
    const MobilePromotionCard = ({ promotion }: { promotion: Promotion }) => (
        <div className="border rounded-lg p-4 mb-3 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <div className="font-medium text-base">{promotion.no_promo}</div>
                    <div className="text-sm text-muted-foreground mt-1 font-mono">
                        {promotion.sku}
                    </div>
                </div>
                <div className={cn(
                    'px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1',
                    promotion.status
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                )}>
                    <span className={cn(
                        'w-1.5 h-1.5 rounded-full',
                        promotion.status ? 'bg-green-500' : 'bg-red-500'
                    )} />
                    {promotion.status ? t('common.active') : t('common.inactive')}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-y-3 text-sm">
                <div>
                    <div className="text-muted-foreground">{t('promotions.columns.material')}</div>
                    <div className="font-mono">{promotion.matnr}</div>
                </div>
                <div>
                    <div className="text-muted-foreground">{t('promotions.columns.shop')}</div>
                    <div>{promotion.shop}</div>
                </div>
                <div>
                    <div className="text-muted-foreground">{t('promotions.columns.price')}</div>
                    <div className="font-medium flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        <span className="tabular-nums">
                            {promotion.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                </div>
                <div>
                    <div className="text-muted-foreground">{t('promotions.columns.comparePrice')}</div>
                    <div className="font-medium flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        <span className="tabular-nums">
                            {promotion.compare_price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                </div>
                <div className="col-span-2">
                    <div className="text-muted-foreground">{t('promotions.columns.createdAt')}</div>
                    <div className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(promotion.created_at), 'MMM d, yyyy')}
                    </div>
                </div>
            </div>
        </div>
    );

    const TableSkeleton = () => (
        <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 rounded-lg animate-pulse">
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-4 w-[80px]" />
                    <Skeleton className="h-4 w-[80px]" />
                    <Skeleton className="h-4 w-[60px]" />
                    <Skeleton className="h-4 w-[100px]" />
                </div>
            ))}
        </div>
    );

    // Mobile skeleton for loading state
    const MobileTableSkeleton = () => (
        <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="border rounded-lg p-4 mb-3 space-y-4 animate-pulse">
                    <div className="flex justify-between">
                        <Skeleton className="h-5 w-[100px]" />
                        <Skeleton className="h-5 w-[80px] rounded-full" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Skeleton className="h-3 w-[60px] mb-2" />
                            <Skeleton className="h-4 w-[80px]" />
                        </div>
                        <div>
                            <Skeleton className="h-3 w-[60px] mb-2" />
                            <Skeleton className="h-4 w-[80px]" />
                        </div>
                        <div>
                            <Skeleton className="h-3 w-[60px] mb-2" />
                            <Skeleton className="h-4 w-[80px]" />
                        </div>
                        <div>
                            <Skeleton className="h-3 w-[60px] mb-2" />
                            <Skeleton className="h-4 w-[80px]" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    if (isLoading) {
        return (
            <Card className="p-4 sm:p-6">
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <Skeleton className="h-10 w-full sm:w-[300px]" />
                        <Skeleton className="h-10 w-full sm:w-[120px]" />
                    </div>
                    {isTablet ? <TableSkeleton /> : <MobileTableSkeleton />}
                </div>
            </Card>
        );
    }

    if (isError) {
        return (
            <Card className="p-4 sm:p-6">
                <div className="flex flex-col items-center justify-center py-10 sm:py-16 text-center space-y-4 sm:space-y-6">
                    <div className="rounded-full bg-red-50 p-3 sm:p-4">
                        <Package className="h-6 w-6 sm:h-8 sm:w-8 text-red-500" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg sm:text-xl">{t('promotions.error.title')}</h3>
                        <p className="text-sm sm:text-base max-w-[500px] px-4 sm:px-0">
                            {t('promotions.error.description')}
                        </p>
                    </div>
                    <Button
                        onClick={() => window.location.reload()}
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                        {t('promotions.error.tryAgain')}
                    </Button>
                </div>
            </Card>
        );
    }

    if (!data) return null;

    const { data: promotions, pagination } = data;
    const totalPages = Math.ceil(pagination.length / itemsPerPage);

    return (
        <Card className="overflow-hidden">
            <div className="p-4 sm:p-6 border-b">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
                    <div className="relative w-full sm:w-auto sm:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
                        <Input
                            type="text"
                            placeholder={t('promotions.searchPlaceholder')}
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="pl-10 h-11 w-full transition-colors"
                        />
                    </div>
                    <Button
                        variant="outline"
                        size="lg"
                        className="w-full sm:w-auto flex items-center justify-center gap-2 h-11 px-4 sm:px-6 transition-all duration-200 shadow-sm hover:shadow"
                        onClick={() => exportToCSV(promotions)}
                    >
                        <Download className="h-4 w-4" />
                        {t('promotions.exportCSV')}
                    </Button>
                </div>
            </div>

            {/* Mobile view */}
            {!isTablet && (
                <div className="p-4">
                    {isFetching && (
                        <div className="absolute inset-0 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-200">
                            <div className="p-4 rounded-xl shadow-lg">
                                <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
                            </div>
                        </div>
                    )}

                    <div className="space-y-1">
                        {promotions.map((promotion) => (
                            <MobilePromotionCard
                                key={`${promotion.no_promo}-${promotion.sku}`}
                                promotion={promotion}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Tablet and Desktop view */}
            {isTablet && (
                <ScrollArea className="relative">
                    {isFetching && (
                        <div className="absolute inset-0 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-200">
                            <div className="p-4 rounded-xl shadow-lg">
                                <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
                            </div>
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="transition-colors">
                                    <TableHead className="font-semibold">
                                        <div className="flex items-center gap-2">
                                            <Hash className="h-4 w-4" />
                                            {t('promotions.columns.promoNumber')}
                                        </div>
                                    </TableHead>
                                    <TableHead className="font-semibold">
                                        <div className="flex items-center gap-2">
                                            <Barcode className="h-4 w-4" />
                                            {t('promotions.columns.sku')}
                                        </div>
                                    </TableHead>
                                    {isDesktop && (
                                        <TableHead className="font-semibold">
                                            <div className="flex items-center gap-2">
                                                <Tag className="h-4 w-4" />
                                                {t('promotions.columns.material')}
                                            </div>
                                        </TableHead>
                                    )}
                                    <TableHead className="font-semibold">
                                        <div className="flex items-center gap-2">
                                            <Store className="h-4 w-4" />
                                            {t('promotions.columns.shop')}
                                        </div>
                                    </TableHead>
                                    <TableHead className="font-semibold">
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="h-4 w-4" />
                                            {t('promotions.columns.price')}
                                        </div>
                                    </TableHead>
                                    {isDesktop && (
                                        <TableHead className="font-semibold">
                                            <div className="flex items-center gap-2">
                                                <ArrowUpDown className="h-4 w-4" />
                                                {t('promotions.columns.comparePrice')}
                                            </div>
                                        </TableHead>
                                    )}
                                    <TableHead className="font-semibold">{t('promotions.columns.status')}</TableHead>
                                    <TableHead className="font-semibold">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            {t('promotions.columns.createdAt')}
                                        </div>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {promotions.map((promotion) => (
                                    <TableRow
                                        key={`${promotion.no_promo}-${promotion.sku}`}
                                        className="transition-colors"
                                    >
                                        <TableCell className="font-medium">{promotion.no_promo}</TableCell>
                                        <TableCell className="font-mono text-sm">{promotion.sku}</TableCell>
                                        {isDesktop && (
                                            <TableCell className="font-mono text-sm">{promotion.matnr}</TableCell>
                                        )}
                                        <TableCell>{promotion.shop}</TableCell>
                                        <TableCell className="tabular-nums">
                                            <div className="flex items-center gap-1">
                                                <DollarSign className="h-3 w-3" />
                                                {promotion.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                            </div>
                                        </TableCell>
                                        {isDesktop && (
                                            <TableCell className="tabular-nums">
                                                <div className="flex items-center gap-1">
                                                    <DollarSign className="h-3 w-3" />
                                                    {promotion.compare_price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                </div>
                                            </TableCell>
                                        )}
                                        <TableCell>
                                            <div className={cn(
                                                'px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1',
                                                promotion.status
                                                    ? 'bg-green-50 text-green-700 border border-green-200'
                                                    : 'bg-red-50 text-red-700 border border-red-200'
                                            )}>
                                                <span className={cn(
                                                    'w-1.5 h-1.5 rounded-full',
                                                    promotion.status ? 'bg-green-500' : 'bg-red-500'
                                                )} />
                                                {promotion.status ? t('common.active') : t('common.inactive')}
                                            </div>
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="h-3 w-3" />
                                                {format(new Date(promotion.created_at), 'MMM d, yyyy')}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </ScrollArea>
            )}

            <div className="border-t p-3 sm:p-4">
                <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                    onItemsPerPageChange={handleItemsPerPageChange}
                />
            </div>
        </Card>
    );
}