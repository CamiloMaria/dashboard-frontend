import {
    Check,
    X,
    MoreHorizontal,
    Image as ImageIcon,
    Pencil,
    Trash2,
    ExternalLink,
    ChevronRight,
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
import { useState } from 'react';

export interface ProductRowProps {
    product: Product;
    onEdit: (id: number) => void;
    onDelete: (product: Product) => void;
    isMobileView?: boolean;
}

export function ProductRow({ product, onEdit, onDelete, isMobileView = false }: ProductRowProps) {
    const { t } = useTranslation();
    const [expanded, setExpanded] = useState(false);

    // Mobile card view
    if (isMobileView) {
        return (
            <div className="mb-4 bg-card rounded-lg shadow-sm border border-border/40 overflow-hidden">
                <div
                    className="flex items-center justify-between p-4 cursor-pointer"
                    onClick={() => setExpanded(!expanded)}
                >
                    <div className="flex items-center gap-3">
                        <div className="relative group/image flex-shrink-0">
                            {product.image_url ? (
                                <img
                                    src={product.image_url}
                                    alt={product.title}
                                    className="h-12 w-12 rounded-lg object-cover ring-1 ring-border/10"
                                    loading="lazy"
                                />
                            ) : (
                                <div className="h-12 w-12 rounded-lg bg-muted/50 ring-1 ring-border/10 flex items-center justify-center">
                                    <ImageIcon className="h-5 w-5 text-muted-foreground/70" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{product.title}</div>
                            <div className="text-sm text-muted-foreground">{product.sku}</div>
                        </div>
                    </div>
                    <ChevronRight className={cn(
                        "h-5 w-5 text-muted-foreground transition-transform duration-200",
                        expanded && "rotate-90"
                    )} />
                </div>

                {expanded && (
                    <div className="px-4 pb-4 pt-0 space-y-3 border-t border-border/20">
                        <div className="grid grid-cols-2 gap-3 mt-3">
                            <div>
                                <div className="text-xs text-muted-foreground mb-1">{t('products.list.columns.material')}</div>
                                <Badge
                                    variant="outline"
                                    className="font-normal bg-background/50 transition-colors"
                                >
                                    {product.material}
                                </Badge>
                            </div>
                            <div>
                                <div className="text-xs text-muted-foreground mb-1">{t('products.list.columns.bigItem')}</div>
                                <Badge
                                    variant={product.bigItems ? 'default' : 'secondary'}
                                    className={cn(
                                        "font-normal transition-colors",
                                        product.bigItems
                                            ? "bg-blue-500/15 text-blue-600 hover:bg-blue-500/25 border-blue-500/20"
                                            : "bg-background/50"
                                    )}
                                >
                                    {product.bigItems ? t('products.list.row.yes') : t('products.list.row.no')}
                                </Badge>
                            </div>
                            <div>
                                <div className="text-xs text-muted-foreground mb-1">{t('products.list.columns.status')}</div>
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
                            </div>
                            <div>
                                <div className="text-xs text-muted-foreground mb-1">{t('products.list.columns.date')}</div>
                                <div className="font-medium tabular-nums text-muted-foreground text-sm">
                                    {new Date(product.create_at).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2 mt-2 border-t border-border/10">
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-9 gap-1.5"
                                onClick={() => onEdit(product.id)}
                            >
                                <Pencil className="h-3.5 w-3.5" />
                                {t('products.list.row.edit')}
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                className="h-9 gap-1.5"
                                onClick={() => onDelete(product)}
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                                {t('products.list.row.delete')}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Desktop table row view
    return (
        <TableRow key={product.id} className="group">
            <TableCell className="hidden sm:table-cell">
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
            <TableCell className="hidden md:table-cell">
                <div className="font-medium text-sm">{product.sku}</div>
            </TableCell>
            <TableCell>
                <div className="max-w-[300px] md:max-w-none">
                    <div className="font-medium truncate">{product.title}</div>
                    <div className="md:hidden text-xs text-muted-foreground mt-0.5">{product.sku}</div>
                </div>
            </TableCell>
            <TableCell className="hidden lg:table-cell">
                <Badge
                    variant="outline"
                    className="font-normal bg-background/50 transition-colors group-hover:bg-background"
                >
                    {product.material}
                </Badge>
            </TableCell>
            <TableCell className="hidden md:table-cell">
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
                        <span className="hidden sm:inline">{t('products.list.row.active')}</span>
                    </Badge>
                ) : (
                    <Badge
                        variant="destructive"
                        className="bg-red-500/15 text-red-600 hover:bg-red-500/25 border-red-500/20"
                    >
                        <X className="h-3.5 w-3.5 mr-1" />
                        <span className="hidden sm:inline">{t('products.list.row.inactive')}</span>
                    </Badge>
                )}
            </TableCell>
            <TableCell className="hidden md:table-cell">
                <div className="font-medium tabular-nums text-muted-foreground">
                    {new Date(product.create_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                    })}
                </div>
            </TableCell>
            <TableCell className="text-right">
                <div className="flex items-center justify-end opacity-100 transition-opacity">
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