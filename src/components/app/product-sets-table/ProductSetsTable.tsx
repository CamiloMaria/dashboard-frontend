import { useState, useCallback, useTransition, Fragment } from 'react';
import {
    ChevronDown,
    Loader2,
    Search,
    Package,
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


export function ProductSetsTable() {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    const [, startTransition] = useTransition();

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

    // Loading skeleton component
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
                    <h3 className="font-semibold text-lg">Failed to load product sets</h3>
                    <p className="text-sm text-muted-foreground max-w-[500px]">
                        There was an error loading the product sets. Please try again or contact support if the problem persists.
                    </p>
                    <Button
                        onClick={() => window.location.reload()}
                        className="mt-2"
                    >
                        Try Again
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
            <Card className="p-6">
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                    <div className="rounded-full bg-muted p-3">
                        <Package className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-lg">No product sets found</h3>
                    <p className="text-sm text-muted-foreground max-w-[500px]">
                        {searchTerm
                            ? "No product sets match your search criteria. Try adjusting your search terms."
                            : "There are no product sets available at the moment."}
                    </p>
                </div>
            </Card>
        );
    }

    return (
        <Card>
            <div className="p-4 border-b">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search by SKU or title..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="pl-10"
                    />
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
                            <TableHead className="w-[40px]"></TableHead>
                            <TableHead>Set SKU</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead className="min-w-[120px]">Price</TableHead>
                            <TableHead>Area</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>Updated At</TableHead>
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
                                    <TableCell>{productSet.title}</TableCell>
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
                                    <TableCell className="whitespace-nowrap">
                                        {format(new Date(productSet.create_at), 'MMM d, yyyy')}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        {format(new Date(productSet.update_at), 'MMM d, yyyy')}
                                    </TableCell>
                                </TableRow>
                                {expandedRows.has(productSet.setSku) && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="p-0 border-0">
                                            <div className="bg-muted/50 p-4 space-y-4">
                                                <h4 className="font-medium text-sm text-muted-foreground px-2">
                                                    Products in Set ({productSet.products.length})
                                                </h4>
                                                <div className="grid grid-cols-2 gap-6">
                                                    {productSet.products.map((product) => (
                                                        <Card
                                                            key={product.id}
                                                            className="p-4 hover:bg-accent transition-colors"
                                                        >
                                                            <div className="space-y-2">
                                                                <p className="font-medium line-clamp-2">{product.title}</p>
                                                                <div className="flex items-center justify-between text-sm">
                                                                    <span className="text-muted-foreground">
                                                                        SKU: {product.sku}
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
                                                                    <span>Grupo: {product.grupo}</span>
                                                                    <span>•</span>
                                                                    <span>Depto: {product.depto}</span>
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