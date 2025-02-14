import { Label } from '@/components/ui/label';
import { type Product } from '@/types/product';

export interface ProductInfoFieldsProps {
    product: Product | undefined;
}

export function ProductInfoFields({ product }: ProductInfoFieldsProps) {
    return (
        <div className="grid grid-cols-2 gap-4">
            <div>
                <Label className="text-muted-foreground">SKU</Label>
                <p className="text-sm font-medium mt-1">{product?.sku || 'Not set'}</p>
            </div>
            <div>
                <Label className="text-muted-foreground">Brand</Label>
                <p className="text-sm font-medium mt-1">{product?.brand || 'Not set'}</p>
            </div>
            <div>
                <Label className="text-muted-foreground">Unit</Label>
                <p className="text-sm font-medium mt-1">{product?.unit || 'Not set'}</p>
            </div>
            <div>
                <Label className="text-muted-foreground">Category</Label>
                <p className="text-sm font-medium mt-1">{product?.category || 'Not set'}</p>
            </div>
            <div>
                <Label className="text-muted-foreground">Big Item</Label>
                <p className="text-sm font-medium mt-1">{product?.bigItems ? 'Yes' : 'No'}</p>
            </div>
            <div>
                <Label className="text-muted-foreground">Without Stock</Label>
                <p className="text-sm font-medium mt-1">{product?.without_stock ? 'Yes' : 'No'}</p>
            </div>
            <div>
                <Label className="text-muted-foreground">Department</Label>
                <p className="text-sm font-medium mt-1">{product?.depto || 'Not set'}</p>
            </div>
            <div>
                <Label className="text-muted-foreground">Group</Label>
                <p className="text-sm font-medium mt-1">{product?.grupo || 'Not set'}</p>
            </div>
        </div>
    );
} 