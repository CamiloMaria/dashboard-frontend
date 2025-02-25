import {
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    ChevronDown,
    Plus,
    Trash2,
    Upload,
    Replace,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { type Image } from '@/types/product';
import { ConfirmationDialog } from '@/components/app/ConfirmationDialog';
import { useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export interface ImageEditorProps {
    images: Image[];
    currentImageIndex: number;
    onImageUpload: (file: File, replaceIndex?: number) => void;
    onImageDelete: (index: number) => void;
    onNavigate: (direction: 'prev' | 'next') => void;
    onReorder: (direction: 'up' | 'down') => void;
    onImageDeleteConfirm: () => void;
    imageToDelete: number | null;
    onImageDeleteDialogChange: (open: boolean) => void;
    isMobile?: boolean;
    isTablet?: boolean;
}

export function ImageEditor({
    images,
    currentImageIndex,
    onImageUpload,
    onImageDelete,
    onNavigate,
    onReorder,
    onImageDeleteConfirm,
    imageToDelete,
    onImageDeleteDialogChange,
    isMobile,
    isTablet,
}: ImageEditorProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();
    const [isReplacing, setIsReplacing] = useState(false);
    const { t } = useTranslation();

    const validateFile = (file: File) => {
        // Check file type
        if (!file.type.startsWith('image/')) {
            toast({
                title: t('products.editor.form.images.validation.invalidType'),
                description: t('products.editor.form.images.validation.invalidTypeDescription'),
                variant: 'destructive',
            });
            return false;
        }

        // Check file size (5MB limit)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
            toast({
                title: t('products.editor.form.images.validation.tooLarge'),
                description: t('products.editor.form.images.validation.tooLargeDescription'),
                variant: 'destructive',
            });
            return false;
        }

        return true;
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!validateFile(file)) return;

        // If we're replacing an image, replace the current one
        const shouldReplace = isReplacing;
        onImageUpload(file, shouldReplace ? currentImageIndex : undefined);

        // Reset the input so the same file can be selected again
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        // Reset replacing state
        setIsReplacing(false);

        // Show success toast
        toast({
            title: shouldReplace ? t('products.editor.form.images.success.replaced') : t('products.editor.form.images.success.added'),
            description: shouldReplace ? t('products.editor.form.images.success.replacedDescription') : t('products.editor.form.images.success.addedDescription'),
        });
    };

    const handleImageClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (images.length > 0) {
            setIsReplacing(true);
            fileInputRef.current?.click();
        }
    };

    const handleAddClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsReplacing(false);
        fileInputRef.current?.click();
    };

    return (
        <div className={cn(
            "relative w-full",
            isMobile ? "max-w-full" : isTablet ? "max-w-[350px] mx-auto" : "lg:w-[400px]"
        )}>
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileSelect}
                aria-label="Upload image"
            />

            <div className="aspect-square rounded-lg border bg-muted relative overflow-hidden cursor-pointer group">
                <div className="absolute top-3 right-3 z-10">
                    <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
                        {images.length > 0
                            ? t('products.editor.form.images.imageCount', { current: currentImageIndex + 1, total: images.length })
                            : t('products.editor.form.images.noImages')}
                    </Badge>
                </div>

                {images.length > 0 ? (
                    <>
                        <div
                            className="relative w-full h-full"
                            onClick={handleImageClick}
                        >
                            <img
                                src={images[currentImageIndex].src}
                                alt={images[currentImageIndex].alt || 'Product'}
                                className="object-cover w-full h-full hover:opacity-90 transition-all duration-300"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="gap-2"
                                >
                                    <Replace className="h-4 w-4" />
                                    {t('products.editor.form.images.replaceImage')}
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div
                        className="w-full h-full flex flex-col items-center justify-center gap-4 hover:bg-muted/80 transition-colors p-4"
                        onClick={handleAddClick}
                    >
                        <Upload className="h-8 sm:h-12 w-8 sm:w-12 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground text-center">
                            {t('products.editor.form.images.uploadHint')}
                        </p>
                        <p className="text-xs text-muted-foreground/70 text-center">
                            {t('products.editor.form.images.uploadRequirements')}
                        </p>
                    </div>
                )}

                {images.length > 1 && (
                    <>
                        <Button
                            variant="secondary"
                            size="icon"
                            className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-9 sm:w-9"
                            onClick={(e) => {
                                e.stopPropagation();
                                onNavigate('prev');
                            }}
                            type="button"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="secondary"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-9 sm:w-9"
                            onClick={(e) => {
                                e.stopPropagation();
                                onNavigate('next');
                            }}
                            type="button"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </>
                )}
            </div>

            <div className="flex flex-wrap items-center gap-1 mt-3 sm:mt-5 px-2 py-2 sm:px-3 sm:py-2 bg-background/90 backdrop-blur-sm rounded-lg border">
                <Button
                    variant="default"
                    size="sm"
                    className="gap-1 sm:gap-2 px-2 sm:px-3 h-8 text-xs sm:text-sm"
                    onClick={handleAddClick}
                    type="button"
                >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>{t('products.editor.form.images.addImage')}</span>
                </Button>

                <Separator orientation="vertical" className="h-6 mx-1 hidden sm:block" />

                <Button
                    variant="destructive"
                    size="sm"
                    className="gap-1 sm:gap-2 px-2 sm:px-3 h-8 text-xs sm:text-sm"
                    onClick={() => onImageDelete(currentImageIndex)}
                    disabled={images.length === 0}
                    type="button"
                >
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>{t('products.editor.form.images.deleteImage')}</span>
                </Button>

                {images.length > 1 && (
                    <>
                        <Separator orientation="vertical" className="h-6 mx-1 hidden sm:block" />
                        <div className="flex gap-1 ml-auto sm:ml-0">
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                                onClick={() => onReorder('up')}
                                disabled={currentImageIndex === images.length - 1}
                                type="button"
                                aria-label={t('products.editor.form.images.moveUp')}
                            >
                                <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                                onClick={() => onReorder('down')}
                                disabled={currentImageIndex === 0}
                                type="button"
                                aria-label={t('products.editor.form.images.moveDown')}
                            >
                                <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                        </div>
                    </>
                )}
            </div>

            <ConfirmationDialog
                open={imageToDelete !== null}
                title={t('products.editor.form.images.deleteDialog.title')}
                description={t('products.editor.form.images.deleteDialog.description')}
                isLoading={false}
                confirmText={t('common.delete')}
                cancelText={t('common.cancel')}
                confirmVariant="destructive"
                onConfirm={onImageDeleteConfirm}
                onCancel={() => onImageDeleteDialogChange(false)}
            />
        </div>
    );
}