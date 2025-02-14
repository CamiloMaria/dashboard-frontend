import { useState, useCallback, useTransition } from 'react';
import {
  Loader2,
  Search,
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

export function ProductsTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [, startTransition] = useTransition();

  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const debouncedSearch = useDebounce(searchTerm);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value !== searchTerm) {
      setCurrentPage(1);
      setItemsPerPage(5); // Reset to default items per page
    }
  };

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: productKeys.list({ page: currentPage, limit: itemsPerPage, search: debouncedSearch }),
    queryFn: () => productsApi.getProducts({ page: currentPage, limit: itemsPerPage, search: debouncedSearch }),
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <p className="text-lg font-medium text-muted-foreground">
          {t('products.list.loadingError')}
        </p>
        <Button onClick={() => queryClient.invalidateQueries({ queryKey: productKeys.all })}>
          {t('products.list.tryAgain')}
        </Button>
      </div>
    );
  }

  if (!data) return null;

  const { data: products, pagination } = data;
  const totalPages = Math.ceil(pagination.length / itemsPerPage);

  return (
    <div className="rounded-lg border bg-card">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t('products.list.searchPlaceholder')}
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 w-2/3"
          />
        </div>
      </div>

      {(isLoading || isFetching) && (
        <div className="flex justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}

      {isError && (
        <div className="text-center text-red-500">
          {t('products.list.loadingError')}
        </div>
      )}

      {!isLoading && !isError && (
        <div className="rounded-lg border bg-card">
          {(isFetching || deleteMutation.isPending) && (
            <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
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
      )}
    </div>
  );
}