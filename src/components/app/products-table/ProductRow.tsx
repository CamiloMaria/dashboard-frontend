import {
    Check,
    X,
    MoreHorizontal,
    Image as ImageIcon,
} from 'lucide-react';
import {
    TableCell,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { type Product } from '@/types/product';

export interface ProductRowProps {
    product: Product;
    onEdit: (id: number) => void;
    onDelete: (product: Product) => void;
}

export function ProductRow({ product, onEdit, onDelete }: ProductRowProps) {
    return (
        <TableRow key={product.id} className="hover:bg-muted/50">
            <TableCell>
                {product.image_url ? (
                    <img
                        src={product.image_url}
                        alt={product.title}
                        className="h-10 w-10 rounded-md object-cover"
                        loading="lazy"
                    />
                ) : (
                    <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                )}
            </TableCell>
            <TableCell className="font-medium">{product.sku}</TableCell>
            <TableCell>{product.title}</TableCell>
            <TableCell>
                <Badge variant="secondary" className="font-normal">
                    {product.material}
                </Badge>
            </TableCell>
            <TableCell>
                <Badge
                    variant={product.bigItems ? 'default' : 'secondary'}
                    className="font-normal"
                >
                    {product.bigItems ? 'Yes' : 'No'}
                </Badge>
            </TableCell>
            <TableCell>
                {product.isActive ? (
                    <Badge variant="success" className="bg-green-500/15 text-green-600 hover:bg-green-500/25">
                        <Check className="h-3.5 w-3.5 mr-1" />
                        Active
                    </Badge>
                ) : (
                    <Badge variant="destructive" className="bg-red-500/15 text-red-600 hover:bg-red-500/25">
                        <X className="h-3.5 w-3.5 mr-1" />
                        Inactive
                    </Badge>
                )}
            </TableCell>
            <TableCell className="font-medium">
                {new Date(product.create_at).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit',
                })}
            </TableCell>
            <TableCell className="text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => onEdit(product.id)}>
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => onDelete(product)}
                        >
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    );
} 