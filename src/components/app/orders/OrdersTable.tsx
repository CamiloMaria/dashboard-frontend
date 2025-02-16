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
    Package2
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

export function OrdersTable() {
    const { t } = useTranslation();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    const [storeFilter, setStoreFilter] = useState<string>('all');
    const [, startTransition] = useTransition();

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
            order: 'desc',
            sortBy: 'fecha_registro',
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
            <Card className="p-6">
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <div className="p-4 rounded-full shadow-lg">
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
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
            <Card className="p-6">
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-6">
                    <div className="rounded-full bg-red-50 p-4">
                        <Package2 className="h-8 w-8 text-red-500" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-semibold text-xl">{t('orders.error')}</h3>
                        <p className="max-w-[500px]">
                            {t('orders.errorDescription')}
                        </p>
                    </div>
                    <Button
                        onClick={() => window.location.reload()}
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                        {t('orders.tryAgain')}
                    </Button>
                </div>
            </Card>
        );
    }

    if (!data) return null;

    const { data: orders, pagination } = data;
    const totalPages = Math.ceil(pagination.length / itemsPerPage);

    return (
        <Card className="overflow-hidden">
            <div className="p-6 border-b">
                <div className="flex flex-wrap items-center justify-between gap-6">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
                            <Input
                                type="text"
                                placeholder={t('orders.searchPlaceholder')}
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="pl-10 h-11 min-w-[300px] transition-colors"
                            />
                        </div>
                        <Select value={storeFilter} onValueChange={setStoreFilter}>
                            <SelectTrigger className="w-[180px] h-11 transition-colors">
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
                        className="flex items-center gap-2 h-11 px-6 transition-all duration-200 shadow-sm hover:shadow"
                        onClick={() => {/* TODO: Implement export */ }}
                    >
                        <Download className="h-4 w-4" />
                        {t('orders.export')}
                    </Button>
                </div>
            </div>

            <ScrollArea className="relative">
                {isFetching && (
                    <div className="absolute inset-0 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-200">
                        <div className="p-4 rounded-xl shadow-lg">
                            <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
                        </div>
                    </div>
                )}

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
                            <TableHead>
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    {t('orders.columns.rnc')}
                                </div>
                            </TableHead>
                            <TableHead>
                                <div className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4" />
                                    {t('orders.columns.total')}
                                </div>
                            </TableHead>
                            <TableHead>
                                <div className="flex items-center gap-2">
                                    <Globe className="h-4 w-4" />
                                    {t('orders.columns.source')}
                                </div>
                            </TableHead>
                            <TableHead>
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    {t('orders.columns.ptlog')}
                                </div>
                            </TableHead>
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
                                            <span>{order.NOMBRE} {order.APELLIDOS}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {order.RNC ? (
                                            <div className="space-y-1">
                                                <div className="font-medium">{order.RNC}</div>
                                                <div className="text-sm">{order.RNC_NAME}</div>
                                            </div>
                                        ) : (
                                            <span className="italic">N/A</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 font-medium">
                                            <DollarSign className="h-3 w-3" />
                                            <span className="tabular-nums">
                                                {order.TOTAL.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200">
                                            <Globe className="h-3 w-3" />
                                            {order.ORDEN_DESDE}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4" />
                                            {order.PTLOG || <span className="italic">N/A</span>}
                                        </div>
                                    </TableCell>
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
                                        <TableCell colSpan={9} className="p-0 border-0">
                                            <div className="p-6">
                                                <OrderDetails order={order} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </Fragment>
                        ))}
                    </TableBody>
                </Table>
            </ScrollArea>

            <div className="border-t p-4">
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