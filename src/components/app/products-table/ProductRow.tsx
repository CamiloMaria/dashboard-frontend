import {
    Check,
    X,
    MoreHorizontal,
    Image as ImageIcon,
    Pencil,
    Trash2,
    ExternalLink,
} from 'lucide-react';
import {
    TableCell,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { type Product } from '@/types/product';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export interface ProductRowProps {
    product: Product;
    onEdit: (id: number) => void;
    onDelete: (product: Product) => void;
}

export function ProductRow({ product, onEdit, onDelete }: ProductRowProps) {
    const { t } = useTranslation();

    return (
        <TableRow key={product.id} className="group">
            <TableCell>
                <div className="relative group/image">
                    {product.image_url ? (
                        <>
                            <img
                                src={product.image_url}
                                alt={product.title}
                                className="h-12 w-12 rounded-lg object-cover ring-1 ring-border/10 transition-transform group-hover/image:scale-105"
                                loading="lazy"
                            />
                            <a
                                href={product.image_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg opacity-0 transition-opacity group-hover/image:opacity-100"
                            >
                                <ExternalLink className="h-4 w-4 text-white" />
                            </a>
                        </>
                    ) : (
                        <div className="h-12 w-12 rounded-lg bg-muted/50 ring-1 ring-border/10 flex items-center justify-center transition-colors group-hover:bg-muted">
                            <ImageIcon className="h-5 w-5 text-muted-foreground/70" />
                        </div>
                    )}
                </div>
            </TableCell>
            <TableCell>
                <div className="font-medium text-sm">{product.sku}</div>
            </TableCell>
            <TableCell>
                <div className="max-w-[300px]">
                    <div className="font-medium truncate">{product.title}</div>
                </div>
            </TableCell>
            <TableCell>
                <Badge
                    variant="outline"
                    className="font-normal bg-background/50 transition-colors group-hover:bg-background"
                >
                    {product.material}
                </Badge>
            </TableCell>
            <TableCell>
                <Badge
                    variant={product.bigItems ? 'default' : 'secondary'}
                    className={cn(
                        "font-normal transition-colors",
                        product.bigItems
                            ? "bg-blue-500/15 text-blue-600 hover:bg-blue-500/25 border-blue-500/20"
                            : "bg-background/50 group-hover:bg-background"
                    )}
                >
                    {product.bigItems ? t('products.list.row.yes') : t('products.list.row.no')}
                </Badge>
            </TableCell>
            <TableCell>
                {product.isActive ? (
                    <Badge
                        variant="success"
                        className="bg-green-500/15 text-green-600 hover:bg-green-500/25 border-green-500/20"
                    >
                        <Check className="h-3.5 w-3.5 mr-1" />
                        {t('products.list.row.active')}
                    </Badge>
                ) : (
                    <Badge
                        variant="destructive"
                        className="bg-red-500/15 text-red-600 hover:bg-red-500/25 border-red-500/20"
                    >
                        <X className="h-3.5 w-3.5 mr-1" />
                        {t('products.list.row.inactive')}
                    </Badge>
                )}
            </TableCell>
            <TableCell>
                <div className="font-medium tabular-nums text-muted-foreground">
                    {new Date(product.create_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                    })}
                </div>
            </TableCell>
            <TableCell className="text-right">
                <div className="flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => onEdit(product.id)}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                                onClick={() => onEdit(product.id)}
                                className="gap-2"
                            >
                                <Pencil className="h-4 w-4" />
                                {t('products.list.row.edit')}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => onDelete(product)}
                                className="text-red-600 gap-2"
                            >
                                <Trash2 className="h-4 w-4" />
                                {t('products.list.row.delete')}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </TableCell>
        </TableRow>
    );
}