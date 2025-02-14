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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  type Product,
  type Image,
  type ProductFormValues,
  productFormSchema,
  ProductsResponse,
  Specification,
} from '@/types/product';
import { productsApi } from '@/api/products';
import { productKeys } from '@/api/query-keys';
import { type DisableReason } from '@/constants/product';
import { SHOPS } from '@/constants/shops';
import {
  ImageEditor,
  ProductInfoFields,
  LoadingOverlay,
  ActionButtons,
  DisableReasonDialog,
  ProductTabs,
} from './';
import { productsListRoute } from '@/routes/app/products-list';
import { Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';
interface ProductEditorProps {
  productId?: string;
}

export function ProductEditor({ productId }: ProductEditorProps) {
  const { t } = useTranslation();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState<Image[]>([]);
  const [imageToDelete, setImageToDelete] = useState<number | null>(null);
  const [showDisableDialog, setShowDisableDialog] = useState(false);
  const [pendingActiveState, setPendingActiveState] = useState<boolean | null>(null);
  const [specifications, setSpecifications] = useState<Specification[]>([]);
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);

  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      title: '',
      isActive: false,
      disabledShops: [],
      disabledShopsComment: '',
      security_stock: 10,
    },
  });

  const { data: product, isLoading } = useQuery({
    queryKey: productKeys.detail(productId),
    queryFn: () => productsApi.getProduct(Number(productId)),
    enabled: !!productId,
  });

  useEffect(() => {
    if (product) {
      form.reset({
        title: product.title || '',
        isActive: !!product.isActive,
        disabledShops: product.disabledShops || [],
        disabledShopsComment: product.disabledShopsComment || '',
        security_stock: product.security_stock || 10,
      });
      setImages(product.images || []);
      setSpecifications(product.specifications || []);
      setDescription(product.description_instaleap || '');
      setKeywords(product.search_keywords || []);
    }
  }, [product, form]);

  const updateMutation = useMutation({
    mutationFn: async ({ sku, data, deletedImageIds, newImages }: {
      id: number;
      sku: string;
      data: Partial<Product>;
      deletedImageIds?: number[];
      newImages?: File[];
    }) => {
      try {
        // 1. Delete images if any
        if (deletedImageIds?.length) {
          await productsApi.deleteProductImages(sku || '', deletedImageIds);
        }

        // 2. Update product
        const updatedProduct = await productsApi.updateProduct(sku || '', data);

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
            ...data,
            images: images,
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
              p.id === id ? { ...p, ...data, images } : p
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
      form.setValue('disabledShops', []);
      form.setValue('disabledShopsComment', '');
      form.setValue('borrado', 0);
    }
  };

  const handleDisableConfirm = (reason: DisableReason, shops: string[]) => {
    const isAllShopsSelected = SHOPS.every(shop => shops.includes(shop));

    form.setValue('isActive', false);
    form.setValue('disabledShops', shops);
    form.setValue('disabledShopsComment', reason);
    form.setValue('borrado', isAllShopsSelected ? 1 : 0);
    setShowDisableDialog(false);
    setPendingActiveState(null);
  };

  const handleDisableCancel = () => {
    setShowDisableDialog(false);
    setPendingActiveState(null);
    // Reset the switch to its previous state
    form.setValue('isActive', !pendingActiveState);
  };

  const onSubmit = (values: ProductFormValues) => {
    const productData = {
      ...values,
      images: images.map(img => ({
        ...img,
        position: img.position
      })),
      specifications,
      description_instaleap: description,
      search_keywords: keywords,
    };

    if (productId) {
      updateMutation.mutate({
        id: Number(productId),
        sku: product?.sku || '',
        data: productData,
        deletedImageIds: deletedImageIds.length > 0 ? deletedImageIds : undefined,
        newImages: newImages.length > 0 ? newImages : undefined,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <LoadingOverlay
          isLoading={updateMutation.isPending}
          message={productId ? t('products.updating') : ''}
        />

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>{t('products.basicInfo')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-6">
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
              />

              <div className="flex-1 space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('products.editor.form.productName')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="security_stock"
                  render={({ field }) => (
                    <FormItem className="rounded-lg border p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <FormLabel className="font-medium">
                          {t('products.editor.form.securityStock.label')}
                        </FormLabel>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={e => field.onChange(Number(e.target.value))}
                              min={0}
                              className="max-w-[180px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                        <div className="flex-[2]">
                          <p className="text-sm text-muted-foreground">
                            {t('products.editor.form.securityStock.description')}
                          </p>
                        </div>
                      </div>
                    </FormItem>
                  )}
                />

                <ProductInfoFields product={product} />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => {
                    const disabledShopsComment = form.watch('disabledShopsComment');
                    const disabledShops = form.watch('disabledShops');
                    return (
                      <FormItem className="flex flex-col rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <FormLabel>{t('products.editor.form.activeStatus.label')}</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              {t('products.editor.form.activeStatus.description')}
                            </p>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={handleStatusChange}
                            />
                          </FormControl>
                        </div>
                        {(!field.value && disabledShopsComment) && (
                          <div className="mt-4 pt-4 border-t space-y-2">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">
                                {t('products.editor.form.activeStatus.disableReason')}
                              </p>
                              <p className="text-sm font-medium text-red-600 mt-1">
                                {disabledShopsComment}
                              </p>
                            </div>
                            {disabledShops?.length > 0 && (
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                  {t('products.editor.form.activeStatus.disabledShops')}
                                </p>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {disabledShops.map((shop) => (
                                    <span
                                      key={shop}
                                      className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold text-red-600 border-red-600/20 bg-red-600/10"
                                    >
                                      {shop}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
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
          category={product?.category || ''}
          specifications={specifications}
          onSpecificationsChange={setSpecifications}
          description={description}
          onDescriptionChange={setDescription}
          keywords={keywords}
          onKeywordsChange={setKeywords}
        />

        <Separator />

        <ActionButtons
          isLoading={isLoading}
          isPending={updateMutation.isPending}
          onCancel={() => navigate({ to: productsListRoute.fullPath })}
        />

        <DisableReasonDialog
          open={showDisableDialog}
          onConfirm={handleDisableConfirm}
          onCancel={handleDisableCancel}
        />
      </form>
    </Form>
  );
}