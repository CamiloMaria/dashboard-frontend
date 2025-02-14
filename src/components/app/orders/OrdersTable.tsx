import { useState, useCallback, useTransition, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ChevronDown,
    Loader2,
    Search,
    Download,
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
                <div className="flex justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            </Card>
        );
    }

    if (isError) {
        return (
            <Card className="p-6">
                <div className="flex justify-center">
                    <p>{t('orders.error')}</p>
                </div>
            </Card>
        );
    }

    if (!data) return null;

    const { data: orders, pagination } = data;
    const totalPages = Math.ceil(pagination.length / itemsPerPage);

    return (
        <Card>
            <div className="p-4 border-b">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder={t('orders.searchPlaceholder')}
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="pl-10 w-[300px]"
                            />
                        </div>
                        <Select value={storeFilter} onValueChange={setStoreFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder={t('orders.filterByStore')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{t('orders.allStores')}</SelectItem>
                                <SelectItem value="PL08">PL08</SelectItem>
                                <SelectItem value="PL09">PL09</SelectItem>
                                <SelectItem value="PL10">PL10</SelectItem>
                                <SelectItem value="PL16">PL16</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() => {/* TODO: Implement export */ }}
                    >
                        <Download className="h-4 w-4" />
                        {t('orders.export')}
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
                        <TableRow>
                            <TableHead className="w-[40px]"></TableHead>
                            <TableHead>{t('orders.columns.orderNumber')}</TableHead>
                            <TableHead>{t('orders.columns.customer')}</TableHead>
                            <TableHead>{t('orders.columns.rnc')}</TableHead>
                            <TableHead>{t('orders.columns.total')}</TableHead>
                            <TableHead>{t('orders.columns.source')}</TableHead>
                            <TableHead>{t('orders.columns.store')}</TableHead>
                            <TableHead>{t('orders.columns.date')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                            <Fragment key={order.ORDEN}>
                                <TableRow
                                    className="cursor-pointer hover:bg-muted/50"
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
                                    <TableCell>{order.NOMBRE} {order.APELLIDOS}</TableCell>
                                    <TableCell>
                                        {order.RNC ? (
                                            <div className="space-y-1">
                                                <div className="font-medium">{order.RNC}</div>
                                                <div className="text-sm text-muted-foreground">{order.RNC_NAME}</div>
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground">N/A</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        ${order.TOTAL.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </TableCell>
                                    <TableCell>
                                        <div className="px-2 py-1 rounded-full text-xs font-medium inline-block bg-muted text-muted-foreground">
                                            {order.ORDEN_DESDE}
                                        </div>
                                    </TableCell>
                                    <TableCell>{order.TIENDA}</TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        {format(new Date(order.FECHA_REGISTRO), 'MMM d, yyyy')}
                                    </TableCell>
                                </TableRow>
                                {expandedRows.has(order.ID) && (
                                    <TableRow>
                                        <TableCell colSpan={8} className="p-0 border-0">
                                            <OrderDetails order={order} />
                                        </TableCell>
                                    </TableRow>
                                )}
                            </Fragment>
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