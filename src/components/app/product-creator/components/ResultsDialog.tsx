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
import { Download, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { getResultStats } from '../hooks/useProductCreation';
import { CreateProductResult } from '@/types/product';

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
            ['SKU', 'Status', 'Error'],
            ...results.map(result => [
                result.sku || '',
                result.status === 'created' ? 'Created' : result.status === 'updated' ? 'Updated' : 'Failed',
                result.error || ''
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
                    <div className="flex gap-4">
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
                    <div className="space-y-2">
                        {results.map((result, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "flex items-center justify-between p-2 rounded-lg",
                                    result.status === 'failed' ? "bg-red-50 dark:bg-red-950/50" : "hover:bg-muted/50"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    {result.status === 'created' ? (
                                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
                                    ) : result.status === 'updated' ? (
                                        <RefreshCw className="h-4 w-4 text-indigo-600 dark:text-indigo-500" />
                                    ) : (
                                        <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-500" />
                                    )}
                                    <span className="font-mono">{result.sku}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            "font-medium",
                                            result.status === 'created' && "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-950/50 dark:text-emerald-400",
                                            result.status === 'updated' && "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-950/50 dark:text-indigo-400",
                                            result.status === 'failed' && "border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-950/50 dark:text-red-400"
                                        )}
                                    >
                                        {result.status === 'created' ? "Created" :
                                            result.status === 'updated' ? "Updated" :
                                                "Failed"}
                                    </Badge>
                                    {result.error && (
                                        <span className="text-sm font-medium text-red-700 dark:text-red-400" role="alert">
                                            {result.error}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                <div className="flex justify-end gap-2">
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