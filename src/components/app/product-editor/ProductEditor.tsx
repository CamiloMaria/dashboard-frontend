import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  type Product,
  type Image,
  type ProductFormValues,
  productFormSchema,
  ProductsResponse,
  Specification,
  UpdateProductResult,
  type Catalog,
  type CatalogUpdate,
} from '@/types/product';
import { productsApi } from '@/api/products';
import { productKeys } from '@/api/query-keys';
import { type DisableReason } from '@/constants/product';
import {
  ImageEditor,
  ProductInfoFields,
  LoadingOverlay,
  ActionButtons,
  DisableReasonDialog,
  ProductTabs,
} from './';
import { productsListRoute } from '@/routes/app/products-list';
import { AlertCircle, Package } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from '@/hooks/use-media-query';

interface ProductEditorProps {
  productId?: string;
}

export function ProductEditor({ productId }: ProductEditorProps) {
  const { t } = useTranslation();
  const isMobile = useMediaQuery('(max-width: 640px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState<Image[]>([]);
  const [imageToDelete, setImageToDelete] = useState<number | null>(null);
  const [showDisableDialog, setShowDisableDialog] = useState(false);
  const [pendingActiveState, setPendingActiveState] = useState<boolean | null>(null);
  const [specifications, setSpecifications] = useState<Specification[]>([]);
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  // Track modified catalog IDs
  const [modifiedCatalogIds, setModifiedCatalogIds] = useState<number[]>([]);

  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      title: '',
      isActive: false,
      borrado_comment: '',
      security_stock: 10,
      // catalogs: [],
    },
  });

  const { data: product, isLoading } = useQuery({
    queryKey: productKeys.detail(productId),
    queryFn: () => productsApi.getProduct(Number(productId)),
    select: (data) => data.data,
    enabled: !!productId,
  });

  useEffect(() => {
    if (product) {
      form.reset({
        title: product.title || '',
        isActive: !!product.isActive,
        borrado_comment: product.borrado_comment || '',
        security_stock: product.security_stock || 10,
        // catalogs: product.catalogs || [],
      });
      setImages(product.images || []);
      setSpecifications(product.specifications || []);
      setDescription(product.description_instaleap || '');
      setKeywords(product.search_keywords || []);
      setCatalogs(product.catalogs || []);
      // Reset modified catalog IDs when product data is loaded
      setModifiedCatalogIds([]);
    }
  }, [product, form]);

  const updateMutation = useMutation({
    mutationFn: async ({ id, sku, data, deletedImageIds, newImages }: {
      id: number;
      sku: string;
      data: Partial<UpdateProductResult>;
      deletedImageIds?: number[];
      newImages?: File[];
    }) => {
      try {
        // 1. Delete images if any
        if (deletedImageIds?.length) {
          await productsApi.deleteProductImages(sku || '', deletedImageIds);
        }

        // 2. Update product
        const updatedProduct = await productsApi.updateProduct(id, data);

        // 3. Upload new images if any
        if (newImages?.length) {
          await productsApi.updateProductImages(sku || '', newImages);
        }

        return updatedProduct;
      } catch (error) {
        // Clean up arrays on error
        setDeletedImageIds([]);
        setNewImages([]);
        throw error;
      }
    },
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: productKeys.detail(String(id)) });
      await queryClient.cancelQueries({ queryKey: productKeys.all });

      // Snapshot the previous values
      const previousProduct = queryClient.getQueryData<Product>(
        productKeys.detail(String(id))
      );
      const previousProducts = queryClient.getQueryData<ProductsResponse>(
        productKeys.list({ page: 1, limit: 5 })
      );

      // Optimistically update the product detail
      if (previousProduct) {
        queryClient.setQueryData<Product>(
          productKeys.detail(String(id)),
          {
            ...previousProduct,
            ...(data.product ? {
              title: data.product.title || previousProduct.title,
              description_instaleap: data.product.description_instaleap || previousProduct.description_instaleap,
              security_stock: data.product.security_stock !== undefined ? data.product.security_stock : previousProduct.security_stock,
              // Handle parsed JSON fields properly
              specifications: data.product.specifications
                ? (typeof data.product.specifications === 'string'
                  ? JSON.parse(data.product.specifications)
                  : data.product.specifications)
                : previousProduct.specifications,
              search_keywords: data.product.search_keywords
                ? (typeof data.product.search_keywords === 'string'
                  ? JSON.parse(data.product.search_keywords)
                  : data.product.search_keywords)
                : previousProduct.search_keywords,
            } : {}),
            images: images,
            // Convert CatalogUpdate to Catalog for optimistic UI if catalogs exist
            ...(data.catalogs && previousProduct.catalogs ? {
              catalogs: previousProduct.catalogs.map(catalog => {
                const update = data.catalogs?.find(cu => cu.id === catalog.id);
                return update ? { ...catalog, ...update } : catalog;
              })
            } : {})
          }
        );
      }

      // Optimistically update the products list
      if (previousProducts) {
        queryClient.setQueryData<ProductsResponse>(
          productKeys.list({ page: 1, limit: 5 }),
          {
            ...previousProducts,
            data: previousProducts.data.map((p) =>
              p.id === id ? {
                ...p,
                ...(data.product ? {
                  title: data.product.title || p.title,
                  description_instaleap: data.product.description_instaleap || p.description_instaleap,
                  security_stock: data.product.security_stock !== undefined ? data.product.security_stock : p.security_stock,
                  // Handle parsed JSON fields properly
                  specifications: data.product.specifications
                    ? (typeof data.product.specifications === 'string'
                      ? JSON.parse(data.product.specifications)
                      : data.product.specifications)
                    : p.specifications,
                  search_keywords: data.product.search_keywords
                    ? (typeof data.product.search_keywords === 'string'
                      ? JSON.parse(data.product.search_keywords)
                      : data.product.search_keywords)
                    : p.search_keywords,
                } : {}),
                images,
                // Convert CatalogUpdate to Catalog for optimistic UI if catalogs exist
                ...(data.catalogs && p.catalogs ? {
                  catalogs: p.catalogs.map(catalog => {
                    const update = data.catalogs?.find(cu => cu.id === catalog.id);
                    return update ? { ...catalog, ...update } : catalog;
                  })
                } : {})
              } : p
            ),
          }
        );
      }

      return { previousProduct, previousProducts };
    },
    onError: (err, variables, context) => {
      // Rollback to the previous values
      if (context?.previousProduct) {
        queryClient.setQueryData(
          productKeys.detail(String(variables.id)),
          context.previousProduct
        );
      }
      if (context?.previousProducts) {
        queryClient.setQueryData(
          productKeys.list({ page: 1, limit: 5 }),
          context.previousProducts
        );
      }
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to update the product. Please try again.',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      // Clean up arrays on success
      setDeletedImageIds([]);
      setNewImages([]);
      // Reset modified catalog IDs
      setModifiedCatalogIds([]);
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      toast({
        title: 'Product updated',
        description: 'The product has been updated successfully.',
      });
      navigate({ to: productsListRoute.fullPath });
    },
  });

  // Track deleted and new images
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);

  const handleImageUpload = (file: File, replaceIndex?: number) => {
    // Create a temporary URL for preview
    const previewUrl = URL.createObjectURL(file);
    const position = (replaceIndex !== undefined ? images[replaceIndex].position : images.length) + 1;

    const newImage = {
      id: replaceIndex !== undefined ? images[replaceIndex].id : images.length + 1,
      product_id: Number(productId) || 0,
      sku: '',
      position,
      width: 800,
      height: 800,
      alt: file.name,
      id_cloudflare: '',
      src: previewUrl,
      created_at: replaceIndex !== undefined ? images[replaceIndex].created_at : new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: null,
    };

    if (replaceIndex !== undefined) {
      // Replace existing image
      const newImagesArray = [...images];
      // Store the old image ID for deletion
      const oldImage = images[replaceIndex];
      if (oldImage.id) {
        setDeletedImageIds(prev => [...prev, oldImage.id]);
      }
      // Revoke the old URL to prevent memory leaks
      URL.revokeObjectURL(images[replaceIndex].src);
      newImagesArray[replaceIndex] = newImage;
      setImages(newImagesArray);
    } else {
      // Add new image
      setImages([...images, newImage]);
    }

    // Create a new File with position in the name
    const extension = file.name.split('.').pop();
    const newFile = new File([file], `${position}.${extension}`, { type: file.type });

    // Store the new file for upload
    setNewImages(prev => [...prev, newFile]);

    // Clean up the temporary URL when the component unmounts
    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  };

  const handleImageDelete = (index: number) => {
    const imageToDelete = images[index];
    if (imageToDelete.id) {
      setDeletedImageIds(prev => [...prev, imageToDelete.id]);
    }
    const newImagesArray = images.filter((_, i) => i !== index);
    setImages(newImagesArray);

    // If we're deleting the last image or current image, adjust the index
    if (newImagesArray.length === 0) {
      setCurrentImageIndex(0);
    } else if (index <= currentImageIndex) {
      setCurrentImageIndex(Math.max(0, currentImageIndex - 1));
    }
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (images.length < 2) return;
    const newIndex = direction === 'prev'
      ? (currentImageIndex - 1 + images.length) % images.length
      : (currentImageIndex + 1) % images.length;
    setCurrentImageIndex(newIndex);
  };

  const reorderImage = (direction: 'up' | 'down') => {
    if (images.length < 2) return;
    const newIndex = direction === 'up'
      ? Math.min(images.length - 1, currentImageIndex + 1)
      : Math.max(0, currentImageIndex - 1)

    if (newIndex !== currentImageIndex) {
      const newImages = [...images];
      const [movedImage] = newImages.splice(currentImageIndex, 1);
      newImages.splice(newIndex, 0, movedImage);
      // Update positions
      newImages.forEach((img, idx) => {
        img.position = idx;
      });
      setImages(newImages);
      setCurrentImageIndex(newIndex);
    }
  };

  const handleImageDeleteClick = (index: number) => {
    setImageToDelete(index);
  };

  const handleImageDeleteConfirm = () => {
    if (imageToDelete !== null) {
      handleImageDelete(imageToDelete);
      setImageToDelete(null);
    }
  };

  const handleStatusChange = (checked: boolean) => {
    if (!checked) {
      setPendingActiveState(checked);
      setShowDisableDialog(true);
    } else {
      form.setValue('isActive', checked);
    }
  };

  const handleDisableConfirm = (reason: DisableReason) => {
    form.setValue('isActive', false);
    form.setValue('borrado_comment', reason);
    setShowDisableDialog(false);
    setPendingActiveState(null);
  };

  const handleDisableCancel = () => {
    setShowDisableDialog(false);
    setPendingActiveState(null);
    // Reset the switch to its previous state
    form.setValue('isActive', !pendingActiveState);
  };

  // Handler for inventory updates from the InventoryTab
  const handleInventoryUpdate = (updatedCatalogs: Catalog[], changedItemIds?: number[]) => {
    setCatalogs(updatedCatalogs);
    if (changedItemIds && changedItemIds.length > 0) {
      // Update the list of modified catalog IDs
      setModifiedCatalogIds(prev => {
        const newIds = [...prev];
        changedItemIds.forEach(id => {
          if (!newIds.includes(id)) {
            newIds.push(id);
          }
        });
        return newIds;
      });
    }
  };

  const onSubmit = (values: ProductFormValues) => {
    // Create a proper UpdateProductResult object with the right structure
    const productUpdateData: Partial<UpdateProductResult> = {
      product: {
        title: values.title,
        description_instaleap: description || undefined,
        specifications: JSON.stringify(specifications) || undefined,
        search_keywords: JSON.stringify(keywords) || undefined,
        security_stock: values.security_stock,
        click_multiplier: 1,
        borrado: values.isActive ? false : true,
        borrado_comment: values.borrado_comment || undefined,
      }
    };

    // If we have catalogs with tracked modifications, include them in the update
    if (modifiedCatalogIds.length > 0 && catalogs.length > 0) {
      // Filter catalogs to only include those with IDs in the modifiedCatalogIds array
      const modifiedItems = catalogs.filter(item => modifiedCatalogIds.includes(item.id));

      if (modifiedItems.length > 0) {
        // Convert modified items to catalog updates
        const catalogUpdates: CatalogUpdate[] = modifiedItems.map(item => ({
          id: item.id,
          status: item.status,
          status_comment: item.status_comment || '',
          manual_override: item.manual_override
        }));

        // Add to update data
        productUpdateData.catalogs = catalogUpdates;
      }
    }

    if (productId) {
      updateMutation.mutate({
        id: Number(productId),
        sku: product?.sku || '',
        data: productUpdateData,
        deletedImageIds: deletedImageIds.length > 0 ? deletedImageIds : undefined,
        newImages: newImages.length > 0 ? newImages : undefined,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <LoadingOverlay
          isLoading={updateMutation.isPending}
          message={productId ? t('products.updating') : ''}
        />

        <div className="space-y-4">
          {isLoading ? (
            <div className="h-[600px] animate-pulse bg-muted rounded-lg" />
          ) : (
            <>
              <Card className="overflow-hidden">
                <CardContent className="p-4 sm:p-6">
                  <div className={`flex flex-col ${!isMobile ? 'lg:flex-row' : ''} gap-6 lg:gap-8`}>
                    <ImageEditor
                      images={images}
                      currentImageIndex={currentImageIndex}
                      onImageUpload={handleImageUpload}
                      onImageDelete={handleImageDeleteClick}
                      onNavigate={navigateImage}
                      onReorder={reorderImage}
                      onImageDeleteConfirm={handleImageDeleteConfirm}
                      imageToDelete={imageToDelete}
                      onImageDeleteDialogChange={(open) => !open && setImageToDelete(null)}
                      isMobile={isMobile}
                      isTablet={isTablet}
                    />

                    <div className="flex-1 space-y-4 sm:space-y-6">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">
                              {t('products.editor.form.productName')}
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="h-10"
                                placeholder={t('products.editor.form.productNamePlaceholder')}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="security_stock"
                        render={({ field }) => (
                          <FormItem className="rounded-lg border p-3 sm:p-4 space-y-2 sm:space-y-3 bg-muted/5">
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4 text-primary" />
                              <FormLabel className="font-medium m-0">
                                {t('products.editor.form.securityStock.label')}
                              </FormLabel>
                            </div>
                            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-6">
                              <div className="w-full sm:w-[180px] sm:flex-none">
                                <FormControl>
                                  <Input
                                    type="number"
                                    {...field}
                                    onChange={e => field.onChange(Number(e.target.value))}
                                    min={0}
                                    className="h-9"
                                  />
                                </FormControl>
                                <FormMessage />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                  {t('products.editor.form.securityStock.description')}
                                </p>
                              </div>
                            </div>
                          </FormItem>
                        )}
                      />

                      <ProductInfoFields
                        product={product}
                        isMobile={isMobile}
                      />

                      <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => {
                          const borradoComment = form.watch('borrado_comment');
                          return (
                            <FormItem className="rounded-lg border p-3 sm:p-4 space-y-3 sm:space-y-4 bg-muted/5">
                              <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                  <FormLabel className="text-base">
                                    {t('products.editor.form.activeStatus.label')}
                                  </FormLabel>
                                  <p className="text-sm text-muted-foreground">
                                    {t('products.editor.form.activeStatus.description')}
                                  </p>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={handleStatusChange}
                                    className="data-[state=checked]:bg-green-600"
                                  />
                                </FormControl>
                              </div>
                              {(!field.value && borradoComment) && (
                                <div className="pt-3 sm:pt-4 border-t space-y-3 sm:space-y-4">
                                  <Alert variant="destructive" className="bg-destructive/5 text-destructive border-destructive/20">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription className="mt-1">
                                      <span className="font-medium block">
                                        {t('products.editor.form.activeStatus.disableReason')}
                                      </span>
                                      <span className="block mt-1">
                                        {borradoComment}
                                      </span>
                                    </AlertDescription>
                                  </Alert>
                                </div>
                              )}
                            </FormItem>
                          );
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <ProductTabs
                product={product}
                title={form.watch('title')}
                sku={product?.sku || ''}
                specifications={specifications}
                onSpecificationsChange={setSpecifications}
                description={description}
                onDescriptionChange={setDescription}
                keywords={keywords}
                onKeywordsChange={setKeywords}
                catalogs={catalogs}
                onInventoryUpdate={handleInventoryUpdate}
                isMobile={isMobile}
                isTablet={isTablet}
              />

              <Separator className="my-6 sm:my-8" />

              <ActionButtons
                isLoading={isLoading}
                isPending={updateMutation.isPending}
                onCancel={() => navigate({ to: productsListRoute.fullPath })}
              />
            </>
          )}
        </div>

        <DisableReasonDialog
          open={showDisableDialog}
          onConfirm={handleDisableConfirm}
          onCancel={handleDisableCancel}
        />
      </form>
    </Form>
  );
}