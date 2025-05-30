import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Upload } from 'lucide-react';
import { useFileUpload, type FileWithPreview } from './hooks/useFileUpload';
import { useProductCreation } from './hooks/useProductCreation';
import { ResultsDialog } from './components/ResultsDialog';
import { FileGrid } from './components/FileGrid';
import { useNavigate } from '@tanstack/react-router';
import { productsListRoute } from '@/routes/app/products-list';
import { productsApi } from '@/api/products';

// Mock API function for file upload with progress
const uploadFiles = async (
    files: FileWithPreview[],
    skuInput: string,
    onProgress: (file: FileWithPreview, progress: number) => void
): Promise<void> => {
    const skus = new Set(skuInput.split(/[\s,]+/).filter(Boolean));
    const skuArray = Array.from(skus);

    // Group files by SKU
    const filesBySku = files.reduce((acc, file) => {
        const sku = file.baseSku || skuArray[0];
        if (!acc[sku]) acc[sku] = [];
        acc[sku].push(file);
        return acc;
    }, {} as Record<string, FileWithPreview[]>);

    // Upload files for each SKU
    for (const [sku, skuFiles] of Object.entries(filesBySku)) {
        const renamedFiles = skuFiles.map((file, index) => {
            const extension = file.name.split('.').pop();
            return new File([file], `${sku}-${index}.${extension}`, { type: file.type });
        });

        try {
            await productsApi.uploadProductImages(renamedFiles);
            // Update progress for all files in this batch
            skuFiles.forEach(file => onProgress(file, 100));
        } catch {
            // Mark failed files with 0 progress
            skuFiles.forEach(file => onProgress(file, 0));
        }
    }
};

export function BulkProductCreator() {
    const {
        files,
        handleFileSelect,
        removeFile,
        clearFiles,
        updateProgress,
    } = useFileUpload();

    const {
        skuInput,
        isCreating,
        results,
        handleSkuInputChange,
        createProducts,
        reset: resetProducts,
    } = useProductCreation();

    const [showResults, setShowResults] = React.useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();


    const handleCreate = async () => {
        const results = await createProducts();
        if (results) {
            if (files.length > 0) {
                // Upload files with progress tracking
                await uploadFiles(files, skuInput, (file, progress) => {
                    updateProgress(file, progress);
                });
            }
            setShowResults(true);
        }
    };

    const handleCancel = () => {
        clearFiles();
        resetProducts();
        navigate({ to: productsListRoute.fullPath });
    };

    const handleFileInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(event.target.files || []);
        const newSkus: Set<string> = new Set(skuInput.split(/[\s,]+/).filter(Boolean));

        await handleFileSelect(selectedFiles, (sku) => {
            newSkus.add(sku);
            handleSkuInputChange(Array.from(newSkus).join(' '));
        });

        // Reset input
        if (event.target.value) {
            event.target.value = '';
        }
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Create Products from SKUs</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Enter SKUs separated by spaces or commas to create multiple products at once.
                    </p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handleFileInputChange}
                    />
                    <div className="flex flex-col gap-4">
                        <Textarea
                            value={skuInput}
                            onChange={(e) => handleSkuInputChange(e.target.value)}
                            placeholder="Enter SKUs (e.g., SKU001 SKU002, SKU003)"
                            className="min-h-[100px] font-mono"
                            disabled={isCreating}
                        />
                        {files.length > 0 && (
                            <div className="border rounded-lg p-2">
                                <FileGrid files={files} onRemove={removeFile} />
                                <div className="mt-2 text-xs text-muted-foreground">
                                    {files.length} {files.length === 1 ? 'image' : 'images'} selected
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-between items-center">
                        <Button
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isCreating}
                            className="gap-2"
                        >
                            <Upload className="h-4 w-4" />
                            Add Files
                        </Button>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={handleCancel}
                                disabled={isCreating}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleCreate}
                                disabled={isCreating || !skuInput.trim()}
                                className="w-[140px]"
                            >
                                {isCreating ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    'Create Products'
                                )}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <ResultsDialog
                open={showResults}
                onOpenChange={setShowResults}
                results={results}
            />
        </>
    );
} 