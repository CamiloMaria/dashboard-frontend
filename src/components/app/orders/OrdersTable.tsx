import { useState, useCallback, useTransition, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ChevronDown,
    Loader2,
    Search,
    Download,
    Calendar,
    Store,
    User,
    FileText,
    DollarSign,
    Globe,
    Package2,
    ChevronRight
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
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ordersApi } from '@/api/orders';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { OrderDetails } from './OrderDetails';
import { orderKeys } from '@/api/query-keys';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Order, SortField } from '@/types/order';

export function OrdersTable() {
    const { t } = useTranslation();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    const [storeFilter, setStoreFilter] = useState<string>('all');
    const [, startTransition] = useTransition();

    // Media query hooks for responsive design
    const isDesktop = useMediaQuery("(min-width: 1024px)");
    const isTablet = useMediaQuery("(min-width: 768px)");

    const debouncedSearch = useDebounce(searchTerm);

    const { data, isLoading, isError, isFetching } = useQuery({
        queryKey: orderKeys.list({
            page: currentPage,
            limit: itemsPerPage,
            search: debouncedSearch,
            store: storeFilter !== 'all' ? storeFilter : undefined
        }),
        queryFn: () => ordersApi.getOrders({
            page: currentPage,
            limit: itemsPerPage,
            search: debouncedSearch,
            sortOrder: 'desc',
            sortBy: SortField.REGISTERED_AT,
            store: storeFilter !== 'all' ? storeFilter : undefined
        }),
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

    const toggleRowExpansion = (orderId: string) => {
        setExpandedRows((prev) => {
            const next = new Set(prev);
            if (next.has(orderId)) {
                next.delete(orderId);
            } else {
                next.add(orderId);
            }
            return next;
        });
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

    if (isLoading) {
        return (
            <Card className="p-4 sm:p-6">
                <div className="flex flex-col items-center justify-center py-8 sm:py-12 space-y-4">
                    <div className="p-4 rounded-full shadow-lg">
                        <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-indigo-500" />
                    </div>
                    <p className="text-sm animate-pulse">
                        {t('orders.loading')}
                    </p>
                </div>
            </Card>
        );
    }

    if (isError) {
        return (
            <Card className="p-4 sm:p-6">
                <div className="flex flex-col items-center justify-center py-10 sm:py-16 text-center space-y-4 sm:space-y-6">
                    <div className="rounded-full bg-red-50 p-3 sm:p-4">
                        <Package2 className="h-6 w-6 sm:h-8 sm:w-8 text-red-500" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg sm:text-xl">{t('orders.error')}</h3>
                        <p className="text-sm sm:text-base max-w-[500px] px-4 sm:px-0">
                            {t('orders.errorDescription')}
                        </p>
                    </div>
                    <Button
                        onClick={() => window.location.reload()}
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                        {t('orders.tryAgain')}
                    </Button>
                </div>
            </Card>
        );
    }

    if (!data) return null;

    const { data: orders, meta } = data;
    const totalPages = meta.pagination.totalPages;

    // Mobile card view for each order
    const MobileOrderCard = ({ order }: { order: Order }) => (
        <div
            className="border rounded-lg p-4 mb-3 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => toggleRowExpansion(order.ID)}
        >
            <div className="flex justify-between items-start mb-3">
                <div>
                    <div className="font-medium text-base">{order.ORDEN}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(order.FECHA_REGISTRO), 'MMM d, yyyy')}
                        </div>
                    </div>
                </div>
                <div className={cn(
                    "transition-transform duration-200",
                    expandedRows.has(order.ID) ? "rotate-90" : "rotate-0"
                )}>
                    <ChevronRight className="h-5 w-5" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-y-3 text-sm">
                <div>
                    <div className="text-muted-foreground">Customer</div>
                    <div className="font-medium truncate">{order.NOMBRE} {order.APELLIDOS}</div>
                </div>
                <div>
                    <div className="text-muted-foreground">Total</div>
                    <div className="font-medium flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        <span className="tabular-nums">
                            {order.TOTAL.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                </div>
                <div>
                    <div className="text-muted-foreground">Store</div>
                    <div className="font-medium">{order.TIENDA}</div>
                </div>
                <div>
                    <div className="text-muted-foreground">Source</div>
                    <div className="px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 border border-indigo-200">
                        <Globe className="h-3 w-3" />
                        {order.ORDEN_DESDE}
                    </div>
                </div>
            </div>

            {expandedRows.has(order.ID) && (
                <div className="mt-4 pt-4 border-t">
                    <OrderDetails order={order} />
                </div>
            )}
        </div>
    );

    return (
        <Card className="overflow-hidden">
            <div className="p-4 sm:p-6 border-b">
                <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center justify-between gap-4 sm:gap-6">
                    <div className="w-full sm:w-auto flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-4">
                        <div className="relative w-full sm:w-auto sm:flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
                            <Input
                                type="text"
                                placeholder={t('orders.searchPlaceholder')}
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="pl-10 h-11 w-full sm:min-w-[250px] md:min-w-[300px] transition-colors"
                            />
                        </div>
                        <Select value={storeFilter} onValueChange={setStoreFilter}>
                            <SelectTrigger className="w-full sm:w-[180px] h-11 transition-colors">
                                <div className="flex items-center gap-2">
                                    <Store className="h-4 w-4" />
                                    <SelectValue placeholder={t('orders.filterByStore')} />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all" className="flex items-center gap-2">
                                    <span>{t('orders.allStores')}</span>
                                </SelectItem>
                                {['PL08', 'PL09', 'PL10', 'PL16'].map((store) => (
                                    <SelectItem key={store} value={store} className="flex items-center gap-2">
                                        <span>{store}</span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button
                        variant="outline"
                        size="lg"
                        className="w-full sm:w-auto flex items-center justify-center gap-2 h-11 px-4 sm:px-6 transition-all duration-200 shadow-sm hover:shadow"
                        onClick={() => {/* TODO: Implement export */ }}
                    >
                        <Download className="h-4 w-4" />
                        {t('orders.export')}
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
                        {orders.map((order) => (
                            <MobileOrderCard key={order.ID} order={order} />
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
                                    <TableHead className="w-[40px]"></TableHead>
                                    <TableHead>
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4" />
                                            {t('orders.columns.orderNumber')}
                                        </div>
                                    </TableHead>
                                    <TableHead>
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            {t('orders.columns.customer')}
                                        </div>
                                    </TableHead>
                                    {isDesktop && (
                                        <TableHead>
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4" />
                                                {t('orders.columns.rnc')}
                                            </div>
                                        </TableHead>
                                    )}
                                    <TableHead>
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="h-4 w-4" />
                                            {t('orders.columns.total')}
                                        </div>
                                    </TableHead>
                                    {isDesktop && (
                                        <TableHead>
                                            <div className="flex items-center gap-2">
                                                <Globe className="h-4 w-4" />
                                                {t('orders.columns.source')}
                                            </div>
                                        </TableHead>
                                    )}
                                    {isDesktop && (
                                        <TableHead>
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4" />
                                                {t('orders.columns.ptlog')}
                                            </div>
                                        </TableHead>
                                    )}
                                    <TableHead>
                                        <div className="flex items-center gap-2">
                                            <Store className="h-4 w-4" />
                                            {t('orders.columns.store')}
                                        </div>
                                    </TableHead>
                                    <TableHead>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            {t('orders.columns.date')}
                                        </div>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.map((order) => (
                                    <Fragment key={order.ORDEN}>
                                        <TableRow
                                            className={cn(
                                                "cursor-pointer transition-colors",
                                                expandedRows.has(order.ID)
                                                    ? ""
                                                    : ""
                                            )}
                                            onClick={() => toggleRowExpansion(order.ID)}
                                        >
                                            <TableCell>
                                                <div
                                                    className="transition-transform duration-200"
                                                    style={{
                                                        transform: expandedRows.has(order.ID)
                                                            ? 'rotate(180deg)'
                                                            : 'rotate(0deg)'
                                                    }}
                                                >
                                                    <ChevronDown className="h-4 w-4" />
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium">{order.ORDEN}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4" />
                                                    <span className="truncate max-w-[150px] md:max-w-[200px]">{order.NOMBRE} {order.APELLIDOS}</span>
                                                </div>
                                            </TableCell>
                                            {isDesktop && (
                                                <TableCell>
                                                    {order.RNC ? (
                                                        <div className="space-y-1">
                                                            <div className="font-medium">{order.RNC}</div>
                                                            <div className="text-sm truncate max-w-[150px]">{order.RNC_NAME}</div>
                                                        </div>
                                                    ) : (
                                                        <span className="italic">N/A</span>
                                                    )}
                                                </TableCell>
                                            )}
                                            <TableCell>
                                                <div className="flex items-center gap-1 font-medium">
                                                    <DollarSign className="h-3 w-3" />
                                                    <span className="tabular-nums">
                                                        {order.TOTAL.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            {isDesktop && (
                                                <TableCell>
                                                    <div className="px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200">
                                                        <Globe className="h-3 w-3" />
                                                        {order.ORDEN_DESDE}
                                                    </div>
                                                </TableCell>
                                            )}
                                            {isDesktop && (
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="h-4 w-4" />
                                                        {order.PTLOG || <span className="italic">N/A</span>}
                                                    </div>
                                                </TableCell>
                                            )}
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Store className="h-4 w-4" />
                                                    {order.TIENDA}
                                                </div>
                                            </TableCell>
                                            <TableCell className="whitespace-nowrap">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="h-3 w-3" />
                                                    {format(new Date(order.FECHA_REGISTRO), 'MMM d, yyyy')}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        {expandedRows.has(order.ID) && (
                                            <TableRow>
                                                <TableCell colSpan={isDesktop ? 9 : 6} className="p-0 border-0">
                                                    <div className="p-4 sm:p-6">
                                                        <OrderDetails order={order} />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </Fragment>
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