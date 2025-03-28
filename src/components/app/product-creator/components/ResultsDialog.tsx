import { useNavigate } from '@tanstack/react-router';
import { productsListRoute } from '@/routes/app/products-list';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Download, CheckCircle2, AlertCircle, RefreshCw, Info } from 'lucide-react';
import { getResultStats } from '../hooks/useProductCreation';
import { CreateProductResult, ProductCreationStatus } from '@/types/product';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip';

interface ResultsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    results: CreateProductResult[];
}

export function ResultsDialog({ open, onOpenChange, results }: ResultsDialogProps) {
    const navigate = useNavigate();
    const stats = getResultStats(results);

    const downloadResults = () => {
        const csvContent = [
            ['SKU', 'Status', 'Message'],
            ...results.map(result => [
                result.sku || '',
                result.status,
                result.message || ''
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'product-creation-results.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Helper function to extract product title from results
    const getProductTitle = (result: CreateProductResult): string => {
        if (result.status === ProductCreationStatus.CREATED) {
            return result.product?.title || 'Product created successfully';
        }
        if (result.status === ProductCreationStatus.EXISTING) {
            return 'Product already exists';
        }
        return result.message || 'Error creating product';
    };

    // Helper to get status color classes
    const getStatusColors = (status: ProductCreationStatus) => {
        switch (status) {
            case ProductCreationStatus.CREATED:
                return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-950/50 dark:text-emerald-400";
            case ProductCreationStatus.EXISTING:
                return "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-950/50 dark:text-indigo-400";
            case ProductCreationStatus.NO_PRICE:
            case ProductCreationStatus.ERROR:
                return "border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-950/50 dark:text-red-400";
            default:
                return "";
        }
    };

    // Helper to get icon based on status
    const getStatusIcon = (status: ProductCreationStatus) => {
        switch (status) {
            case ProductCreationStatus.CREATED:
                return <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-500 flex-shrink-0" />;
            case ProductCreationStatus.EXISTING:
                return <RefreshCw className="h-4 w-4 text-indigo-600 dark:text-indigo-500 flex-shrink-0" />;
            case ProductCreationStatus.NO_PRICE:
            case ProductCreationStatus.ERROR:
                return <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-500 flex-shrink-0" />;
            default:
                return null;
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Product Creation Results</DialogTitle>
                    <DialogDescription>
                        Summary of product creation operation
                    </DialogDescription>
                </DialogHeader>

                <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            <span className="text-sm font-medium">
                                {stats.created} Created
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <RefreshCw className="h-4 w-4 text-indigo-600" />
                            <span className="text-sm font-medium">
                                {stats.updated} Updated
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            <span className="text-sm font-medium">
                                {stats.failed} Failed
                            </span>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={downloadResults}
                    >
                        <Download className="h-4 w-4" />
                        Download CSV
                    </Button>
                </div>

                <ScrollArea className="h-[300px] rounded-md border p-4">
                    <div className="space-y-3">
                        {results.map((result, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "p-3 rounded-lg border",
                                    result.status === ProductCreationStatus.CREATED && "border-emerald-200 bg-emerald-50/30 dark:bg-emerald-950/20",
                                    result.status === ProductCreationStatus.EXISTING && "border-indigo-200 bg-indigo-50/30 dark:bg-indigo-950/20",
                                    result.status === ProductCreationStatus.ERROR && "border-red-200 bg-red-50/30 dark:bg-red-950/20"
                                )}
                            >
                                <div className="flex flex-col space-y-2">
                                    {/* Header with SKU and status */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(result.status)}
                                            <span className="font-mono font-medium">{result.sku}</span>
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className={cn(
                                                "font-medium",
                                                getStatusColors(result.status)
                                            )}
                                        >
                                            {result.status}
                                        </Badge>
                                    </div>

                                    {/* Product details with proper overflow handling */}
                                    <div className="ml-6">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className="flex items-start gap-1.5 max-w-full">
                                                        <Info className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                                            {result.status === ProductCreationStatus.CREATED
                                                                ? `Product created successfully: ${result.product?.title || ''}`
                                                                : getProductTitle(result)}
                                                        </p>
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent side="bottom" className="max-w-xs">
                                                    <p>{result.status === ProductCreationStatus.CREATED
                                                        ? `Product created successfully: ${result.product?.title || ''}`
                                                        : getProductTitle(result)}
                                                    </p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                <div className="flex justify-end gap-2 mt-2">
                    <Button
                        onClick={() => {
                            onOpenChange(false);
                            navigate({ to: productsListRoute.fullPath });
                        }}
                    >
                        View Products
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
} 