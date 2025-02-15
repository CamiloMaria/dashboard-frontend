import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Loader2, Package } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useDebounce } from '@/hooks/use-debounce';
import { productsApi } from '@/api/products';
import { productSetsApi } from '@/api/product-sets';
import { productKeys, productSetsKeys } from '@/api/query-keys';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Product } from '@/types/product';
import { CreateSetPayload } from '@/types/product-set';
import { ROUTES } from '@/constants/routes';
import { useTranslation } from 'react-i18next';

export function CreateProductSetPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
    const [freeProducts, setFreeProducts] = useState<Set<number>>(new Set());
    const [title, setTitle] = useState('');
    const navigate = useNavigate();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const debouncedSearch = useDebounce(searchTerm);
    const { t } = useTranslation();

    const { data: products = [], isLoading } = useQuery({
        queryKey: productKeys.search(debouncedSearch),
        queryFn: () => productsApi.getProducts({ search: debouncedSearch, page: 1, limit: 25 }),
        select: (data) => data.data.filter(product => product.bigItems === 1),
    });

    const createMutation = useMutation({
        mutationFn: (payload: CreateSetPayload) => productSetsApi.createProductSet(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: productSetsKeys.all });
            toast({
                title: t('productSets.create.success.title'),
                description: t('productSets.create.success.description'),
            });
            navigate({ to: ROUTES.INVENTORY.PRODUCT_SETS.LIST });
        },
        onError: (error) => {
            toast({
                title: t('common.error'),
                description: error instanceof Error ? error.message : 'Failed to create product set',
                variant: 'destructive',
            });
        },
    });

    const handleProductSelect = (product: Product) => {
        setSelectedProducts((prev) => {
            const isSelected = prev.some((p) => p.id === product.id);
            if (isSelected) {
                return prev.filter((p) => p.id !== product.id);
            }
            if (prev.length >= 2) {
                toast({
                    title: t('productSets.create.validation.selectionLimit.title'),
                    description: t('productSets.create.validation.selectionLimit.description'),
                    variant: 'destructive',
                });
                return prev;
            }
            if (prev.length === 1 && prev[0].grupo !== product.grupo) {
                toast({
                    title: t('productSets.create.validation.invalidSelection.title'),
                    description: t('productSets.create.validation.invalidSelection.description'),
                    variant: 'destructive',
                });
                return prev;
            }
            return [...prev, product];
        });
    };

    const handleFreeProductToggle = (productId: number) => {
        setFreeProducts((prev) => {
            const next = new Set(prev);
            if (next.has(productId)) {
                next.delete(productId);
            } else {
                next.add(productId);
            }
            return next;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedProducts.length !== 2) {
            toast({
                title: t('productSets.create.validation.invalidCount.title'),
                description: t('productSets.create.validation.invalidCount.description'),
                variant: 'destructive',
            });
            return;
        }
        if (!title.trim()) {
            toast({
                title: t('productSets.create.validation.missingTitle.title'),
                description: t('productSets.create.validation.missingTitle.description'),
                variant: 'destructive',
            });
            return;
        }

        const payload: CreateSetPayload = {
            title: title.trim(),
            selected_products: selectedProducts.map(product => ({
                sku: product.sku,
                price: product.inventory[0]?.price ?? 0,
                is_free: freeProducts.has(product.id),
                grupo: product.grupo,
            })),
        };

        createMutation.mutate(payload);
    };

    const getProductPrice = (product: Product) => {
        return product.inventory[0]?.price || 0;
    };

    const getProductComparePrice = (product: Product) => {
        return product.inventory[0]?.compare_price || null;
    };

    return (
        <div className="container py-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">{t('productSets.create.title')}</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card className="p-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">{t('productSets.create.setTitle.label')}</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder={t('productSets.create.setTitle.placeholder')}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>{t('productSets.create.selectedProducts.title')} ({selectedProducts.length}/2)</Label>
                            {selectedProducts.length > 0 ? (
                                <div className="grid gap-4">
                                    {selectedProducts.map((product) => (
                                        <Card
                                            key={product.id}
                                            className="p-4 relative overflow-hidden"
                                        >
                                            {freeProducts.has(product.id) && (
                                                <div className="absolute top-0 right-0 bg-green-500 text-white px-2 py-1 text-xs font-medium rounded-bl">
                                                    {t('productSets.create.selectedProducts.freeProduct')}
                                                </div>
                                            )}
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h4 className="font-medium truncate">{product.title}</h4>
                                                    </div>
                                                    <div className="grid gap-1 text-sm">
                                                        <div className="flex items-center text-muted-foreground">
                                                            <span className="w-16">{t('productSets.expandedView.productInfo.sku')}:</span>
                                                            <span className="font-medium text-foreground">{product.sku}</span>
                                                        </div>
                                                        <div className="flex items-center text-muted-foreground">
                                                            <span className="w-16">{t('productSets.columns.price')}:</span>
                                                            <span className="font-medium text-foreground">
                                                                ${getProductPrice(product).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center text-muted-foreground">
                                                            <span className="w-16">{t('productSets.expandedView.productInfo.grupo')}:</span>
                                                            <span className="font-medium text-foreground">{product.grupo}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleProductSelect(product)}
                                                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                    >
                                                        {t('productSets.create.selectedProducts.remove')}
                                                    </Button>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm text-muted-foreground">{t('productSets.create.selectedProducts.isFree')}:</span>
                                                        <Checkbox
                                                            checked={freeProducts.has(product.id)}
                                                            onCheckedChange={() => handleFreeProductToggle(product.id)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <Card className="p-8 flex flex-col items-center justify-center text-center text-muted-foreground">
                                    <Package className="h-8 w-8 mb-2 text-muted-foreground/50" />
                                    <p className="text-sm">{t('productSets.create.selectedProducts.empty.title')}</p>
                                    <p className="text-xs mt-1">{t('productSets.create.selectedProducts.empty.description')}</p>
                                </Card>
                            )}
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="p-4 border-b">
                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder={t('productSets.create.searchProducts.placeholder')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <ScrollArea className="h-[400px]">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]"></TableHead>
                                    <TableHead>{t('productSets.expandedView.productInfo.sku')}</TableHead>
                                    <TableHead>{t('productSets.columns.title')}</TableHead>
                                    <TableHead>{t('productSets.columns.price')}</TableHead>
                                    <TableHead>{t('productSets.expandedView.productInfo.grupo')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                        </TableCell>
                                    </TableRow>
                                ) : products.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                            {t('productSets.noSets.title')}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    products.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedProducts.some((p) => p.id === product.id)}
                                                    onCheckedChange={() => handleProductSelect(product)}
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">{product.sku}</TableCell>
                                            <TableCell>{product.title}</TableCell>
                                            <TableCell>
                                                <div className="space-y-0.5">
                                                    <div className="font-medium">
                                                        ${getProductPrice(product).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                    </div>
                                                    {getProductComparePrice(product) && (
                                                        <div className="text-sm text-muted-foreground line-through">
                                                            ${getProductComparePrice(product)?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>{product.grupo}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </Card>

                <div className="flex justify-end gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate({ to: ROUTES.INVENTORY.PRODUCT_SETS.LIST })}
                    >
                        {t('productSets.create.buttons.cancel')}
                    </Button>
                    <Button
                        type="submit"
                        disabled={selectedProducts.length !== 2 || !title.trim() || createMutation.isPending}
                    >
                        {createMutation.isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {t('productSets.create.buttons.create')}
                    </Button>
                </div>
            </form>
        </div>
    );
} 