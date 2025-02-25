import { Label } from '@/components/ui/label';
import { type Product } from '@/types/product';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export interface ProductInfoFieldsProps {
    product: Product | undefined;
    isMobile?: boolean;
}

export function ProductInfoFields({ product, isMobile }: ProductInfoFieldsProps) {
    const { t } = useTranslation();
    const notSet = t('products.editor.form.info.notSet');

    return (
        <div className={cn(
            "grid gap-4",
            isMobile ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"
        )}>
            <div>
                <Label className="text-muted-foreground">{t('products.editor.form.info.sku')}</Label>
                <p className="text-sm font-medium mt-1 break-words">{product?.sku || notSet}</p>
            </div>
            <div>
                <Label className="text-muted-foreground">{t('products.editor.form.info.brand')}</Label>
                <p className="text-sm font-medium mt-1 break-words">{product?.brand || notSet}</p>
            </div>
            <div>
                <Label className="text-muted-foreground">{t('products.editor.form.info.unit')}</Label>
                <p className="text-sm font-medium mt-1 break-words">{product?.unit || notSet}</p>
            </div>
            <div>
                <Label className="text-muted-foreground">{t('products.editor.form.info.category')}</Label>
                <p className="text-sm font-medium mt-1 break-words">{product?.category || notSet}</p>
            </div>
            <div>
                <Label className="text-muted-foreground">{t('products.editor.form.info.bigItem')}</Label>
                <p className="text-sm font-medium mt-1">{product?.bigItems ? t('products.list.row.yes') : t('products.list.row.no')}</p>
            </div>
            <div>
                <Label className="text-muted-foreground">{t('products.editor.form.info.withoutStock')}</Label>
                <p className="text-sm font-medium mt-1">{product?.without_stock ? t('products.list.row.yes') : t('products.list.row.no')}</p>
            </div>
            <div>
                <Label className="text-muted-foreground">{t('products.editor.form.info.department')}</Label>
                <p className="text-sm font-medium mt-1 break-words">{product?.depto || notSet}</p>
            </div>
            <div>
                <Label className="text-muted-foreground">{t('products.editor.form.info.group')}</Label>
                <p className="text-sm font-medium mt-1 break-words">{product?.grupo || notSet}</p>
            </div>
        </div>
    );
} 