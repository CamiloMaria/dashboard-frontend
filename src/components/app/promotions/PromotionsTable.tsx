import { useState, useCallback, useTransition } from 'react';
import {
    Download,
    Loader2,
    Package,
    Search,
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

export function PromotionsTable() {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [, startTransition] = useTransition();
    const { t } = useTranslation();

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
            setItemsPerPage(10); // Reset to default items per page
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

    // Loading skeleton component
    const TableSkeleton = () => (
        <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4 py-3">
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

    if (isLoading) {
        return (
            <Card className="p-6">
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Skeleton className="h-8 w-[300px]" />
                    </div>
                    <TableSkeleton />
                </div>
            </Card>
        );
    }

    if (isError) {
        return (
            <Card className="p-6">
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                    <div className="rounded-full bg-muted p-3">
                        <Package className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-lg">{t('promotions.error.title')}</h3>
                    <p className="text-sm text-muted-foreground max-w-[500px]">
                        {t('promotions.error.description')}
                    </p>
                    <Button
                        onClick={() => window.location.reload()}
                        className="mt-2"
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
        <Card>
            <div className="p-4 border-b">
                <div className="flex items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder={t('promotions.searchPlaceholder')}
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="pl-10"
                        />
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() => exportToCSV(promotions)}
                    >
                        <Download className="h-4 w-4" />
                        {t('promotions.exportCSV')}
                    </Button>
                </div>
            </div>

            <ScrollArea className="relative">
                {isFetching && (
                    <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-background p-4 rounded-lg shadow-lg">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                    </div>
                )}

                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead>{t('promotions.columns.promoNumber')}</TableHead>
                            <TableHead>{t('promotions.columns.sku')}</TableHead>
                            <TableHead>{t('promotions.columns.material')}</TableHead>
                            <TableHead>{t('promotions.columns.shop')}</TableHead>
                            <TableHead>{t('promotions.columns.price')}</TableHead>
                            <TableHead>{t('promotions.columns.comparePrice')}</TableHead>
                            <TableHead>{t('promotions.columns.status')}</TableHead>
                            <TableHead>{t('promotions.columns.createdAt')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {promotions.map((promotion) => (
                            <TableRow key={`${promotion.no_promo}-${promotion.sku}`}>
                                <TableCell className="font-medium">{promotion.no_promo}</TableCell>
                                <TableCell>{promotion.sku}</TableCell>
                                <TableCell>{promotion.matnr}</TableCell>
                                <TableCell>{promotion.shop}</TableCell>
                                <TableCell>${promotion.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</TableCell>
                                <TableCell>${promotion.compare_price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</TableCell>
                                <TableCell>
                                    <div className={cn(
                                        'px-2 py-1 rounded-full text-xs font-medium inline-block',
                                        promotion.status
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-700'
                                    )}>
                                        {promotion.status ? t('common.active') : t('common.inactive')}
                                    </div>
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                    {format(new Date(promotion.created_at), 'MMM d, yyyy')}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </ScrollArea>

            <div className="border-t">
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
