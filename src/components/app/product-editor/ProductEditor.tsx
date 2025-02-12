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
import {
  ImageEditor,
  ProductInfoFields,
  ProductTabs,
  LoadingOverlay,
  ActionButtons,
  DisableReasonDialog,
} from './';
import { productsListRoute } from '@/routes/app/products-list';

interface ProductEditorProps {
  productId?: string;
}

export function ProductEditor({ productId }: ProductEditorProps) {
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
      borrado_comment: '',
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
        borrado_comment: product.borrado_comment || '',
      });
      setImages(product.images || []);
      setSpecifications(product.specifications || []);
      setDescription(product.description_instaleap || '');
      setKeywords(product.search_keywords || []);
    }
  }, [product, form]);

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Product> }) =>
      productsApi.updateProduct(id, data),
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

    const newImage = {
      id: replaceIndex !== undefined ? images[replaceIndex].id : images.length + 1,
      product_id: Number(productId) || 0,
      sku: '',
      position: replaceIndex !== undefined ? images[replaceIndex].position : images.length,
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
      const newImages = [...images];
      // Revoke the old URL to prevent memory leaks
      URL.revokeObjectURL(images[replaceIndex].src);
      newImages[replaceIndex] = newImage;
      setImages(newImages);
    } else {
      // Add new image
      setImages([...images, newImage]);
    }

    // Clean up the temporary URL when the component unmounts
    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  };

  const handleImageDelete = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    if (currentImageIndex >= newImages.length) {
      setCurrentImageIndex(Math.max(0, newImages.length - 1));
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
      form.setValue('borrado_comment', '');
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
        data: productData,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <LoadingOverlay
          isLoading={updateMutation.isPending}
          message={productId ? 'Updating product...' : ''}
        />

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Basic Information</CardTitle>
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
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <ProductInfoFields product={product} />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => {
                    const borrado_comment = form.watch('borrado_comment');
                    return (
                      <FormItem className="flex flex-col rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <FormLabel>Active Status</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Enable or disable this product
                            </p>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={handleStatusChange}
                            />
                          </FormControl>
                        </div>
                        {!field.value && borrado_comment && (
                          <div className="mt-4 pt-4 border-t">
                            <p className="text-sm font-medium text-muted-foreground">Disable Reason:</p>
                            <p className="text-sm font-medium text-red-600 mt-1">
                              {borrado_comment}
                            </p>
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
          productId={productId}
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