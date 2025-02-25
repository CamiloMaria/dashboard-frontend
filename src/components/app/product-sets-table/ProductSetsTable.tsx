import { useState, useCallback, useTransition, Fragment } from 'react';
import {
    ChevronDown,
    Loader2,
    Search,
    Package,
    Calendar,
    Tag,
    DollarSign,
    MapPin
} from 'lucide-react';
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
    TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebounce } from '@/hooks/use-debounce';
import { PaginationControls } from '../products-table/PaginationControls';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { productSetsApi } from '@/api';
import { productSetsKeys } from '@/api/query-keys';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from '@/hooks/use-media-query';
import { ProductSet, ProductInSet } from '@/types/product-set';

export function ProductSetsTable() {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    const [expandedMobileCards, setExpandedMobileCards] = useState<Set<string>>(new Set());
    const [, startTransition] = useTransition();
    const { t } = useTranslation();

    // Media query hooks for responsive design
    const isDesktop = useMediaQuery("(min-width: 1024px)");
    const isTablet = useMediaQuery("(min-width: 768px)");

    const debouncedSearch = useDebounce(searchTerm);

    const { data, isLoading, isError, isFetching } = useQuery({
        queryKey: productSetsKeys.list({ page: currentPage, limit: itemsPerPage, search: debouncedSearch }),
        queryFn: () => productSetsApi.getProductSets({ page: currentPage, limit: itemsPerPage, search: debouncedSearch }),
        placeholderData: keepPreviousData,
        staleTime: 5000,
    });

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (value !== searchTerm) {
            setCurrentPage(1);
            setItemsPerPage(5); // Reset to default items per page
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

    const toggleRowExpansion = (productSetId: string) => {
        setExpandedRows((prev) => {
            const next = new Set(prev);
            if (next.has(productSetId)) {
                next.delete(productSetId);
            } else {
                next.add(productSetId);
            }
            return next;
        });
    };

    const toggleMobileCardExpansion = (productSetId: string) => {
        setExpandedMobileCards((prev) => {
            const next = new Set(prev);
            if (next.has(productSetId)) {
                next.delete(productSetId);
            } else {
                next.add(productSetId);
            }
            return next;
        });
    };

    // Mobile card view for each product set
    const MobileProductSetCard = ({ productSet }: { productSet: ProductSet }) => (
        <Card className="mb-4 overflow-hidden">
            <div
                className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleMobileCardExpansion(productSet.setSku)}
            >
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <div className="font-medium text-base">{productSet.setSku}</div>
                        <div className="text-sm line-clamp-1 mt-1">{productSet.title}</div>
                    </div>
                    <div className="transition-transform duration-200"
                        style={{
                            transform: expandedMobileCards.has(productSet.setSku)
                                ? 'rotate(180deg)'
                                : 'rotate(0deg)'
                        }}>
                        <ChevronDown className="h-5 w-5" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-y-3 text-sm mt-3">
                    <div>
                        <div className="text-muted-foreground flex items-center gap-1">
                            <DollarSign className="h-3.5 w-3.5" />
                            {t('productSets.columns.price')}
                        </div>
                        <div className="font-medium">
                            ${productSet.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                        {productSet.compare_price && (
                            <div className="text-xs text-green-600 font-medium">
                                {Math.round((1 - productSet.price / productSet.compare_price) * 100)}% off
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {t('productSets.columns.area')}
                        </div>
                        <div>{productSet.area}</div>
                    </div>
                    <div>
                        <div className="text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {t('productSets.columns.createdAt')}
                        </div>
                        <div>{format(new Date(productSet.create_at), 'MMM d, yyyy')}</div>
                    </div>
                    <div>
                        <div className="text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {t('productSets.columns.updatedAt')}
                        </div>
                        <div>{format(new Date(productSet.update_at), 'MMM d, yyyy')}</div>
                    </div>
                </div>
            </div>

            {expandedMobileCards.has(productSet.setSku) && (
                <div className="bg-muted/50 p-4 space-y-4 border-t">
                    <h4 className="font-medium text-sm text-muted-foreground">
                        {t('productSets.expandedView.productsInSet')} ({productSet.products.length})
                    </h4>
                    <div className="space-y-4">
                        {productSet.products.map((product: ProductInSet) => (
                            <Card
                                key={product.id}
                                className="p-4 hover:bg-accent transition-colors"
                            >
                                <div className="space-y-2">
                                    <p className="font-medium line-clamp-2">{product.title}</p>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            {t('productSets.expandedView.productInfo.sku')}: {product.sku}
                                        </span>
                                    </div>
                                    <div className="space-y-0.5">
                                        <div className="font-medium">
                                            ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </div>
                                        {product.compare_price && (
                                            <>
                                                <div className="text-sm text-muted-foreground line-through">
                                                    ${product.compare_price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                </div>
                                                <div className="text-xs text-green-600 font-medium">
                                                    {Math.round((1 - product.price / product.compare_price) * 100)}% off
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                                        <span>{t('productSets.expandedView.productInfo.grupo')}: {product.grupo}</span>
                                        <span>•</span>
                                        <span>{t('productSets.expandedView.productInfo.depto')}: {product.depto}</span>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </Card>
    );

    // Loading skeleton components
    const TableSkeleton = () => (
        <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4 py-3">
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[80px]" />
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-4 w-[100px]" />
                </div>
            ))}
        </div>
    );

    const MobileTableSkeleton = () => (
        <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
                <Card key={i} className="p-4 mb-4">
                    <div className="flex justify-between mb-3">
                        <div>
                            <Skeleton className="h-5 w-[100px] mb-2" />
                            <Skeleton className="h-4 w-[180px]" />
                        </div>
                        <Skeleton className="h-5 w-5 rounded-full" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Skeleton className="h-4 w-[80px] mb-2" />
                            <Skeleton className="h-5 w-[100px]" />
                        </div>
                        <div>
                            <Skeleton className="h-4 w-[80px] mb-2" />
                            <Skeleton className="h-5 w-[100px]" />
                        </div>
                        <div>
                            <Skeleton className="h-4 w-[80px] mb-2" />
                            <Skeleton className="h-5 w-[100px]" />
                        </div>
                        <div>
                            <Skeleton className="h-4 w-[80px] mb-2" />
                            <Skeleton className="h-5 w-[100px]" />
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );

    if (isLoading) {
        return (
            <Card className="p-4 sm:p-6">
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Skeleton className="h-8 w-full sm:w-[300px]" />
                    </div>
                    {isTablet ? <TableSkeleton /> : <MobileTableSkeleton />}
                </div>
            </Card>
        );
    }

    if (isError) {
        return (
            <Card className="p-4 sm:p-6">
                <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center space-y-4">
                    <div className="rounded-full bg-muted p-3">
                        <Package className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-lg">{t('productSets.error.title')}</h3>
                    <p className="text-sm text-muted-foreground max-w-[500px] px-4 sm:px-0">
                        {t('productSets.error.description')}
                    </p>
                    <Button
                        onClick={() => window.location.reload()}
                        className="mt-2"
                    >
                        {t('productSets.error.tryAgain')}
                    </Button>
                </div>
            </Card>
        );
    }

    if (!data) return null;

    const { data: productSets, pagination } = data;
    const totalPages = Math.ceil(pagination.length / itemsPerPage);

    if (productSets.length === 0) {
        return (
            <Card className="p-4 sm:p-6">
                <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center space-y-4">
                    <div className="rounded-full bg-muted p-3">
                        <Package className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-lg">{t('productSets.noSets.title')}</h3>
                    <p className="text-sm text-muted-foreground max-w-[500px] px-4 sm:px-0">
                        {searchTerm
                            ? t('productSets.noSets.withSearch')
                            : t('productSets.noSets.withoutSearch')}
                    </p>
                </div>
            </Card>
        );
    }

    return (
        <Card>
            <div className="p-4 border-b">
                <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder={t('productSets.searchPlaceholder')}
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="pl-10 w-full"
                    />
                </div>
            </div>

            {/* Mobile view */}
            {!isTablet && (
                <div className="p-4">
                    {isFetching && (
                        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50">
                            <div className="bg-background p-4 rounded-lg shadow-lg">
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            </div>
                        </div>
                    )}

                    <div className="space-y-1">
                        {productSets.map((productSet) => (
                            <MobileProductSetCard
                                key={productSet.setSku}
                                productSet={productSet}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Tablet and Desktop view */}
            {isTablet && (
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
                                <TableHead className="w-[40px]"></TableHead>
                                <TableHead>
                                    <div className="flex items-center gap-1.5">
                                        <Tag className="h-4 w-4" />
                                        {t('productSets.columns.setSku')}
                                    </div>
                                </TableHead>
                                <TableHead>{t('productSets.columns.title')}</TableHead>
                                <TableHead className="min-w-[120px]">
                                    <div className="flex items-center gap-1.5">
                                        <DollarSign className="h-4 w-4" />
                                        {t('productSets.columns.price')}
                                    </div>
                                </TableHead>
                                <TableHead>
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="h-4 w-4" />
                                        {t('productSets.columns.area')}
                                    </div>
                                </TableHead>
                                {isDesktop && (
                                    <>
                                        <TableHead>
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="h-4 w-4" />
                                                {t('productSets.columns.createdAt')}
                                            </div>
                                        </TableHead>
                                        <TableHead>
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="h-4 w-4" />
                                                {t('productSets.columns.updatedAt')}
                                            </div>
                                        </TableHead>
                                    </>
                                )}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {productSets.map((productSet) => (
                                <Fragment key={productSet.setSku}>
                                    <TableRow
                                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                                        onClick={() => toggleRowExpansion(productSet.setSku)}
                                    >
                                        <TableCell>
                                            <div className="transition-transform duration-200"
                                                style={{
                                                    transform: expandedRows.has(productSet.setSku)
                                                        ? 'rotate(180deg)'
                                                        : 'rotate(0deg)'
                                                }}>
                                                <ChevronDown className="h-4 w-4" />
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">{productSet.setSku}</TableCell>
                                        <TableCell className="max-w-[250px] truncate">{productSet.title}</TableCell>
                                        <TableCell>
                                            <div className="space-y-0.5">
                                                <div className="font-medium">
                                                    ${productSet.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                </div>
                                                {productSet.compare_price && (
                                                    <div className="text-sm text-muted-foreground line-through">
                                                        ${productSet.compare_price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                    </div>
                                                )}
                                                {productSet.compare_price && (
                                                    <div className="text-xs text-green-600 font-medium">
                                                        {Math.round((1 - productSet.price / productSet.compare_price) * 100)}% off
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>{productSet.area}</TableCell>
                                        {isDesktop && (
                                            <>
                                                <TableCell className="whitespace-nowrap">
                                                    {format(new Date(productSet.create_at), 'MMM d, yyyy')}
                                                </TableCell>
                                                <TableCell className="whitespace-nowrap">
                                                    {format(new Date(productSet.update_at), 'MMM d, yyyy')}
                                                </TableCell>
                                            </>
                                        )}
                                    </TableRow>
                                    {expandedRows.has(productSet.setSku) && (
                                        <TableRow>
                                            <TableCell colSpan={isDesktop ? 7 : 5} className="p-0 border-0">
                                                <div className="bg-muted/50 p-4 space-y-4">
                                                    <h4 className="font-medium text-sm text-muted-foreground px-2">
                                                        {t('productSets.expandedView.productsInSet')} ({productSet.products.length})
                                                    </h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                                        {productSet.products.map((product: ProductInSet) => (
                                                            <Card
                                                                key={product.id}
                                                                className="p-4 hover:bg-accent transition-colors"
                                                            >
                                                                <div className="space-y-2">
                                                                    <p className="font-medium line-clamp-2">{product.title}</p>
                                                                    <div className="flex items-center justify-between text-sm">
                                                                        <span className="text-muted-foreground">
                                                                            {t('productSets.expandedView.productInfo.sku')}: {product.sku}
                                                                        </span>
                                                                    </div>
                                                                    <div className="space-y-0.5">
                                                                        <div className="font-medium">
                                                                            ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                                        </div>
                                                                        {product.compare_price && (
                                                                            <>
                                                                                <div className="text-sm text-muted-foreground line-through">
                                                                                    ${product.compare_price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                                                </div>
                                                                                <div className="text-xs text-green-600 font-medium">
                                                                                    {Math.round((1 - product.price / product.compare_price) * 100)}% off
                                                                                </div>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-2">
                                                                        <span>{t('productSets.expandedView.productInfo.grupo')}: {product.grupo}</span>
                                                                        <span>•</span>
                                                                        <span>{t('productSets.expandedView.productInfo.depto')}: {product.depto}</span>
                                                                    </div>
                                                                </div>
                                                            </Card>
                                                        ))}
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </Fragment>
                            ))}
                        </TableBody>
                    </Table>
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