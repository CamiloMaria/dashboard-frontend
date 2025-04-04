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
  type Catalog,
  type CatalogUpdate,
  type ImagePositionChange,
  type AtomicProductUpdate,
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
  // Track image operations for atomic update
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);
  const [imagesToReorder, setImagesToReorder] = useState<ImagePositionChange[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);

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
      // Reset tracking states when product data is loaded
      setModifiedCatalogIds([]);
      setImagesToDelete([]);
      setImagesToReorder([]);
      setNewImages([]);
    }
  }, [product, form]);

  // New atomic update mutation
  const atomicUpdateMutation = useMutation({
    mutationFn: async ({
      data,
      files
    }: {
      data: AtomicProductUpdate;
      files?: File[];
    }) => {
      return productsApi.atomicProductUpdate(data, files);
    },
    onMutate: async ({ data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: productKeys.detail(productId) });
      await queryClient.cancelQueries({ queryKey: productKeys.all });

      // Snapshot the previous values
      const previousProduct = queryClient.getQueryData<Product>(
        productKeys.detail(productId)
      );
      const previousProducts = queryClient.getQueryData<ProductsResponse>(
        productKeys.list({ page: 1, limit: 5 })
      );

      // Optimistically update the product detail
      if (previousProduct) {
        // Create a copy of images with deletions and reordering applied
        let updatedImages = [...(previousProduct.images || [])];

        // Apply deletions
        if (data.imagesToDelete && data.imagesToDelete.length > 0) {
          updatedImages = updatedImages.filter(img =>
            !data.imagesToDelete?.includes(img.position)
          );
        }

        // Apply reordering
        if (data.imagesToReorder && data.imagesToReorder.length > 0) {
          // Create a position map
          const positionMap = new Map<number, number>();
          data.imagesToReorder.forEach(change => {
            positionMap.set(change.currentPosition, change.newPosition);
          });

          // Apply new positions
          updatedImages = updatedImages.map(img => {
            const newPosition = positionMap.get(img.position);
            if (newPosition !== undefined) {
              return { ...img, position: newPosition };
            }
            return img;
          });

          // Sort by position
          updatedImages.sort((a, b) => a.position - b.position);
        }

        queryClient.setQueryData(
          productKeys.detail(productId),
          {
            ...previousProduct,
            ...(data.metadata ? {
              title: data.metadata.title || previousProduct.title,
              description_instaleap: data.metadata.description_instaleap || previousProduct.description_instaleap,
              security_stock: data.metadata.security_stock !== undefined ? data.metadata.security_stock : previousProduct.security_stock,
              specifications: data.metadata.specifications
                ? (typeof data.metadata.specifications === 'string'
                  ? JSON.parse(data.metadata.specifications)
                  : data.metadata.specifications)
                : previousProduct.specifications,
              search_keywords: data.metadata.search_keywords
                ? (typeof data.metadata.search_keywords === 'string'
                  ? JSON.parse(data.metadata.search_keywords)
                  : data.metadata.search_keywords)
                : previousProduct.search_keywords,
              isActive: data.metadata.borrado !== undefined ? !data.metadata.borrado : previousProduct.isActive,
              borrado_comment: data.metadata.borrado_comment || previousProduct.borrado_comment,
            } : {}),
            images: updatedImages,
            // Update catalogs if provided
            catalogs: data.catalogs && previousProduct.catalogs
              ? previousProduct.catalogs.map(catalog => {
                const update = data.catalogs?.find(cu => cu.id === catalog.id);
                return update ? { ...catalog, ...update } : catalog;
              })
              : previousProduct.catalogs,
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
              p.id === Number(productId) ? {
                ...p,
                ...(data.metadata ? {
                  title: data.metadata.title || p.title,
                  description_instaleap: data.metadata.description_instaleap || p.description_instaleap,
                  security_stock: data.metadata.security_stock !== undefined ? data.metadata.security_stock : p.security_stock,
                  // Handle parsed JSON fields properly
                  specifications: data.metadata.specifications
                    ? (typeof data.metadata.specifications === 'string'
                      ? JSON.parse(data.metadata.specifications)
                      : data.metadata.specifications)
                    : p.specifications,
                  search_keywords: data.metadata.search_keywords
                    ? (typeof data.metadata.search_keywords === 'string'
                      ? JSON.parse(data.metadata.search_keywords)
                      : data.metadata.search_keywords)
                    : p.search_keywords,
                  isActive: data.metadata.borrado !== undefined ? !data.metadata.borrado : p.isActive,
                  borrado_comment: data.metadata.borrado_comment || p.borrado_comment,
                } : {}),
                // Update catalogs if provided
                catalogs: data.catalogs && p.catalogs
                  ? p.catalogs.map(catalog => {
                    const update = data.catalogs?.find(cu => cu.id === catalog.id);
                    return update ? { ...catalog, ...update } : catalog;
                  })
                  : p.catalogs,
              } : p
            ),
          }
        );
      }

      return { previousProduct, previousProducts };
    },
    onError: (err, _, context) => {
      // Rollback to the previous values
      if (context?.previousProduct) {
        queryClient.setQueryData(
          productKeys.detail(productId),
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
      // Reset all tracking states
      setImagesToDelete([]);
      setImagesToReorder([]);
      setNewImages([]);
      setModifiedCatalogIds([]);

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: productKeys.all });

      toast({
        title: 'Product updated',
        description: 'The product has been updated successfully.',
      });

      navigate({ to: productsListRoute.fullPath });
    },
  });

  const handleImageUpload = (file: File, replaceIndex?: number) => {
    // Create a temporary URL for preview
    const previewUrl = URL.createObjectURL(file);

    // Calculate the position for the new image
    let position = 1; // Default position if no images

    if (replaceIndex !== undefined) {
      // Use the existing position if replacing an image
      position = images[replaceIndex].position;
    } else if (images.length > 0) {
      // For a new image, use a position one higher than the current max
      position = Math.max(...images.map(img => img.position || 0)) + 1;
    }

    const newImage = {
      id: replaceIndex !== undefined ? images[replaceIndex].id : Date.now(), // Use timestamp for temp ID
      product_id: Number(productId) || 0,
      sku: product?.sku || '',
      position: position,
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

      // If replacing, mark the old image position for deletion
      const oldImage = images[replaceIndex];
      if (oldImage.position) {
        setImagesToDelete(prev => [...prev, oldImage.position]);
      }

      // Revoke the old URL to prevent memory leaks
      URL.revokeObjectURL(images[replaceIndex].src);

      // Update the image array
      newImagesArray[replaceIndex] = newImage;
      setImages(newImagesArray);
    } else {
      // Add new image to the end
      setImages(prev => {
        const updated = [...prev, newImage];
        // Sort by position to maintain order
        return updated.sort((a, b) => a.position - b.position);
      });
    }

    // Create a new File with position in the name
    const extension = file.name.split('.').pop() || 'jpg';
    const newFile = new File([file], `${product?.sku}.${extension}`, { type: file.type });

    // Store the new file for upload
    setNewImages(prev => [...prev, newFile]);

    // Clean up the temporary URL when the component unmounts
    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  };

  const handleImageDelete = (index: number) => {
    const imageToDelete = images[index];
    // Track image position for deletion in atomic update
    if (imageToDelete.position) {
      setImagesToDelete(prev => [...prev, imageToDelete.position]);
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

    // For image reordering, 'up' means moving image earlier in the sequence (decreasing position)
    // 'down' means moving image later in the sequence (increasing position)
    const targetIndex = direction === 'down'
      ? Math.max(0, currentImageIndex - 1)
      : Math.min(images.length - 1, currentImageIndex + 1);

    // Skip if we can't move in this direction (already at the end)
    if (targetIndex === currentImageIndex) return;

    // Get the current image and target image
    const currentImage = images[currentImageIndex];
    const targetImage = images[targetIndex];

    // Validate both images have positions
    if (currentImage.position === undefined || targetImage.position === undefined) return;

    // Add to imagesToReorder for API update
    const existingReorderIndex = imagesToReorder.findIndex(
      change => change.currentPosition === currentImage.position
    );

    if (existingReorderIndex >= 0) {
      // Update existing reordering entry
      const updatedReorders = [...imagesToReorder];
      updatedReorders[existingReorderIndex] = {
        currentPosition: currentImage.position,
        newPosition: targetImage.position
      };
      setImagesToReorder(updatedReorders);
    } else {
      // Add new reordering entry
      setImagesToReorder(prev => [
        ...prev,
        {
          currentPosition: currentImage.position,
          newPosition: targetImage.position
        }
      ]);
    }

    // Create copy of images array for UI update
    const newImagesArray = [...images];

    // Swap positions between the images for UI display
    const tempPosition = currentImage.position;
    currentImage.position = targetImage.position;
    targetImage.position = tempPosition;

    // Move the current image in the array for UI display
    const [movedImage] = newImagesArray.splice(currentImageIndex, 1);
    newImagesArray.splice(targetIndex, 0, movedImage);

    // Sort images by position for consistent display
    newImagesArray.sort((a, b) => a.position - b.position);

    // Update UI
    setImages(newImagesArray);
    setCurrentImageIndex(targetIndex);
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

  // Helper function to handle array fields properly
  const serializeArrayField = <T extends unknown[]>(array: T): string | undefined => {
    if (array.length === 0) {
      return undefined;
    }
    return JSON.stringify(array);
  };

  const onSubmit = (values: ProductFormValues) => {
    if (!product || !product.sku) {
      toast({
        title: 'Error',
        description: 'Product SKU is required for updates.',
        variant: 'destructive',
      });
      return;
    }

    // Create the atomic update payload
    const atomicUpdateData: AtomicProductUpdate = {
      sku: product.sku,
      // Only include metadata if there are changes
      metadata: {
        title: values.title,
        description_instaleap: description || undefined,
        // Use the helper function to handle empty arrays
        specifications: serializeArrayField(specifications),
        search_keywords: serializeArrayField(keywords),
        security_stock: values.security_stock,
        click_multiplier: 1,
        borrado: values.isActive ? false : true,
        borrado_comment: values.borrado_comment || undefined,
      },
    };

    // Add image operations if necessary
    if (imagesToDelete.length > 0) {
      atomicUpdateData.imagesToDelete = imagesToDelete;
    }

    if (imagesToReorder.length > 0) {
      // Filter out any reorderings with the same source and target position
      const validReorderings = imagesToReorder.filter(
        item => item.currentPosition !== item.newPosition
      );

      if (validReorderings.length > 0) {
        atomicUpdateData.imagesToReorder = validReorderings;
      }
    }

    // Add catalog updates if any were modified
    if (modifiedCatalogIds.length > 0 && catalogs.length > 0) {
      // Filter catalogs to only include those with IDs in the modifiedCatalogIds array
      const modifiedItems = catalogs.filter(item => modifiedCatalogIds.includes(item.id));

      if (modifiedItems.length > 0) {
        // Convert modified items to catalog updates
        const catalogUpdates: CatalogUpdate[] = modifiedItems.map(item => ({
          id: item.id,
          status: item.status,
          status_comment: item.status_comment || null,
          manual_override: item.manual_override
        }));

        // Add to update data
        atomicUpdateData.catalogs = catalogUpdates;
      }
    }

    // Call the atomic update mutation
    atomicUpdateMutation.mutate({
      data: atomicUpdateData,
      files: newImages.length > 0 ? newImages : undefined
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <LoadingOverlay
          isLoading={atomicUpdateMutation.isPending}
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
                isPending={atomicUpdateMutation.isPending}
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