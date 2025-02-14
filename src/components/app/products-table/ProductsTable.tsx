import { useState, useCallback, useTransition } from 'react';
import {
  Loader2,
  Search,
  Package2,
  Plus,
  Filter,
  CheckCircle2,
  XCircle,
  Package,
  SlidersHorizontal,
  ArrowUpDown,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { productsApi } from '@/api/products';
import { ProductsResponse, type Product } from '@/types/product';
import { useNavigate } from '@tanstack/react-router';
import { useToast } from '@/hooks/use-toast';
import { productKeys } from '@/api/query-keys';
import { useDebounce } from '@/hooks/use-debounce';
import {
  ProductRow,
  PaginationControls,
} from '.';
import { ConfirmationDialog } from '../ConfirmationDialog';
import { productEditorRoute } from '@/routes/app/product-editor';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { productsNewRoute } from '@/routes/app/products-new';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export function ProductsTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [filters, setFilters] = useState({
    status: [] as string[],
    bigItem: null as boolean | null,
  });
  const [sortConfig, setSortConfig] = useState({
    field: 'title',
    direction: 'asc' as 'asc' | 'desc',
  });
  const [, startTransition] = useTransition();

  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const debouncedSearch = useDebounce(searchTerm);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value !== searchTerm) {
      setCurrentPage(1);
      setItemsPerPage(5);
    }
  };

  const toggleFilter = (type: 'status' | 'bigItem', value: string | boolean) => {
    setFilters(prev => {
      if (type === 'status') {
        const statusFilters = prev.status.includes(value as string)
          ? prev.status.filter(v => v !== value)
          : [...prev.status, value as string];
        return { ...prev, status: statusFilters };
      } else {
        return { ...prev, bigItem: prev.bigItem === value ? null : value as boolean };
      }
    });
  };

  const clearFilters = () => {
    setFilters({
      status: [],
      bigItem: null,
    });
  };

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: productKeys.list({
      page: currentPage,
      limit: itemsPerPage,
      search: debouncedSearch,
      // filters,
      order: sortConfig.direction,
      sortBy: sortConfig.field,
    }),
    queryFn: () => productsApi.getProducts({
      page: currentPage,
      limit: itemsPerPage,
      search: debouncedSearch,
      // filters,
      order: sortConfig.direction,
      sortBy: sortConfig.field,
    }),
    placeholderData: keepPreviousData,
    staleTime: 5000,
  });

  const deleteMutation = useMutation({
    mutationFn: productsApi.deleteProduct,
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: productKeys.list({ page: currentPage, limit: itemsPerPage }) });
      const previousProducts = queryClient.getQueryData<ProductsResponse>(
        productKeys.list({ page: currentPage, limit: itemsPerPage })
      );

      queryClient.setQueryData<ProductsResponse>(
        productKeys.list({ page: currentPage, limit: itemsPerPage }),
        (old) => old ? {
          ...old,
          data: old.data.filter((p) => p.id !== productId),
        } : old
      );

      return { previousProducts };
    },
    onError: (err, _, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(
          productKeys.list({ page: currentPage, limit: itemsPerPage }),
          context.previousProducts
        );
      }
      toast({
        title: t('common.error'),
        description: err instanceof Error ? err.message : t('messages.deleteError'),
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      toast({
        title: t('common.success'),
        description: t('messages.productDeleted'),
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.list({ page: currentPage, limit: itemsPerPage }) });
    },
  });

  const handleDeleteClick = useCallback((product: Product) => {
    setProductToDelete(product);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (productToDelete) {
      deleteMutation.mutate(productToDelete.id);
      setProductToDelete(null);
    }
  }, [deleteMutation, productToDelete]);

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

  const handleEditProduct = useCallback((productId: number) => {
    navigate({ to: productEditorRoute.fullPath, params: { productId: String(productId) } });
  }, [navigate]);

  const toggleSort = (field: string) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'desc' ? 'asc' : 'desc',
    }));
  };

  if (isLoading) {
    return (
      <Card className="w-full h-[600px] flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
        <div className="flex flex-col items-center gap-4">
          <div className="bg-background/80 p-4 rounded-full shadow-lg">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          <p className="text-sm text-muted-foreground animate-pulse">
            {t('products.list.loading')}
          </p>
        </div>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="w-full h-[600px] flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <div className="rounded-full bg-red-50 p-4">
            <Package2 className="h-8 w-8 text-red-500" />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-xl text-foreground">
              {t('products.list.loadingError')}
            </h3>
            <p className="text-sm text-muted-foreground max-w-[500px]">
              {t('products.list.errorDescription')}
            </p>
          </div>
          <Button
            onClick={() => queryClient.invalidateQueries({ queryKey: productKeys.all })}
            className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {t('products.list.tryAgain')}
          </Button>
        </div>
      </Card>
    );
  }

  if (!data) return null;

  const { data: products, pagination } = data;
  const totalPages = Math.ceil(pagination.length / itemsPerPage);
  const activeFiltersCount = filters.status.length + (filters.bigItem !== null ? 1 : 0);

  return (
    <Card className="relative overflow-hidden">
      <div className="p-6 border-b bg-gradient-to-b from-background to-muted/10">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={t('products.list.searchPlaceholder')}
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10 h-11 bg-background border-muted-foreground/20 hover:border-muted-foreground/40 focus:border-primary transition-colors"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 self-end sm:self-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-11 w-11 relative">
                    <Filter className="h-4 w-4" />
                    {activeFiltersCount > 0 && (
                      <Badge
                        variant="secondary"
                        className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                      >
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <SlidersHorizontal className="h-4 w-4" />
                      {t('products.list.filters.title')}
                    </span>
                    {activeFiltersCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-xs"
                        onClick={clearFilters}
                      >
                        {t('products.list.filters.clear')}
                      </Button>
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                    {t('products.list.filters.status')}
                  </DropdownMenuLabel>
                  <DropdownMenuCheckboxItem
                    checked={filters.status.includes('active')}
                    onCheckedChange={() => toggleFilter('status', 'active')}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                    {t('products.list.filters.active')}
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.status.includes('inactive')}
                    onCheckedChange={() => toggleFilter('status', 'inactive')}
                  >
                    <XCircle className="mr-2 h-4 w-4 text-red-500" />
                    {t('products.list.filters.inactive')}
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                    {t('products.list.filters.type')}
                  </DropdownMenuLabel>
                  <DropdownMenuCheckboxItem
                    checked={filters.bigItem === true}
                    onCheckedChange={() => toggleFilter('bigItem', true)}
                  >
                    <Package className="mr-2 h-4 w-4 text-blue-500" />
                    {t('products.list.filters.bigItems')}
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-11 w-11">
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>{t('products.list.sort.title')}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => toggleSort('update_at')}>
                    {t('products.list.sort.date')}
                    {sortConfig.field === 'update_at' && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({sortConfig.direction === 'desc' ? '↓' : '↑'})
                      </span>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toggleSort('title')}>
                    {t('products.list.sort.productTitle')}
                    {sortConfig.field === 'title' && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({sortConfig.direction === 'desc' ? '↓' : '↑'})
                      </span>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                className="h-11 gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                onClick={() => navigate({ to: productsNewRoute.fullPath })}
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">{t('products.list.addProduct')}</span>
              </Button>
            </div>
          </div>

          {activeFiltersCount > 0 && (
            <>
              <Separator />
              <div className="flex flex-wrap gap-2">
                {filters.status.map((status) => (
                  <Badge
                    key={status}
                    variant="secondary"
                    className="px-2 py-1 gap-2"
                    onClick={() => toggleFilter('status', status)}
                  >
                    {status === 'active' ? (
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                    ) : (
                      <XCircle className="h-3 w-3 text-red-500" />
                    )}
                    {t(`products.list.filters.${status}`)}
                    <XCircle className="h-3 w-3 ml-1 cursor-pointer" />
                  </Badge>
                ))}
                {filters.bigItem !== null && (
                  <Badge
                    variant="secondary"
                    className="px-2 py-1 gap-2"
                    onClick={() => toggleFilter('bigItem', filters.bigItem!)}
                  >
                    <Package className="h-3 w-3 text-blue-500" />
                    {t('products.list.filters.bigItems')}
                    <XCircle className="h-3 w-3 ml-1 cursor-pointer" />
                  </Badge>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="relative">
        {(isFetching || deleteMutation.isPending) && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-200">
            <div className="bg-background p-4 rounded-xl shadow-lg">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/60 transition-colors">
                <TableHead className="w-[100px]">{t('products.list.columns.thumbnail')}</TableHead>
                <TableHead>{t('products.list.columns.sku')}</TableHead>
                <TableHead>{t('products.list.columns.title')}</TableHead>
                <TableHead>{t('products.list.columns.material')}</TableHead>
                <TableHead>{t('products.list.columns.bigItem')}</TableHead>
                <TableHead>{t('products.list.columns.status')}</TableHead>
                <TableHead>{t('products.list.columns.date')}</TableHead>
                <TableHead className="text-right">{t('products.list.columns.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteClick}
                />
              ))}
            </TableBody>
          </Table>
        </div>

        <ConfirmationDialog
          open={!!productToDelete}
          title={t('products.list.deleteConfirmation.title')}
          description={t('products.list.deleteConfirmation.description', {
            product: productToDelete?.sku || productToDelete?.material || productToDelete?.title || ''
          })}
          isLoading={deleteMutation.isPending}
          confirmText={t('common.delete')}
          cancelText={t('common.cancel')}
          confirmVariant="destructive"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setProductToDelete(null)}
        />

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