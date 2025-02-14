import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (itemsPerPage: number) => void;
}

export function PaginationControls({
    currentPage,
    totalPages,
    itemsPerPage,
    onPageChange,
    onItemsPerPageChange,
}: PaginationControlsProps) {
    const { t } = useTranslation();

    const renderPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <Button
                    key={i}
                    variant={currentPage === i ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                        "h-8 w-8 p-0",
                        currentPage === i && "bg-primary text-primary-foreground hover:bg-primary/90",
                        currentPage !== i && "text-muted-foreground hover:bg-muted"
                    )}
                    onClick={() => onPageChange(i)}
                >
                    {i}
                </Button>
            );
        }

        return pages;
    };

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-6 py-4">
            <div className="flex items-center gap-3">
                <p className="text-sm font-medium text-muted-foreground">
                    {t('products.list.pagination.itemsPerPage')}
                </p>
                <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => onItemsPerPageChange(Number(value))}
                >
                    <SelectTrigger className="h-8 w-[70px] border-gray-200 hover:border-gray-300 focus:ring-2 focus:ring-primary">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent align="center">
                        {[5, 10, 20, 50].map((value) => (
                            <SelectItem
                                key={value}
                                value={value.toString()}
                                className="cursor-pointer"
                            >
                                {value}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <div className="text-sm text-muted-foreground">
                    <span className="hidden sm:inline">{t('products.list.pagination.showing')} </span>
                    <span className="font-medium text-foreground">
                        {Math.min((currentPage - 1) * itemsPerPage + 1, totalPages * itemsPerPage)}
                        -
                        {Math.min(currentPage * itemsPerPage, totalPages * itemsPerPage)}
                    </span>
                    <span className="hidden sm:inline"> {t('products.list.pagination.of')} </span>
                    <span className="font-medium text-foreground">{totalPages * itemsPerPage}</span>
                </div>
            </div>

            <div className="flex items-center justify-end gap-2">
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => onPageChange(1)}
                        disabled={currentPage === 1}
                    >
                        <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center">
                        {renderPageNumbers()}
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => onPageChange(totalPages)}
                        disabled={currentPage === totalPages}
                    >
                        <ChevronsRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}