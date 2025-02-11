import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useDebounce } from '@/hooks/use-debounce';
import { CreateProductResult } from '@/types';
import { productsApi } from '@/api';

const parseSkus = (value: string): string[] => 
    value.split(/[\s,]+/).map(sku => sku.trim()).filter(Boolean);

export function useProductCreation() {
    const [skuInput, setSkuInput] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [results, setResults] = useState<CreateProductResult[]>([]);
    const { toast } = useToast();

    const debouncedSkuInput = useDebounce(skuInput);
    const parsedSkus = parseSkus(debouncedSkuInput);

    const handleSkuInputChange = useCallback((value: string) => {
        setSkuInput(value);
    }, []);

    const createProducts = useCallback(async () => {
        if (parsedSkus.length === 0) {
            toast({
                title: 'No SKUs provided',
                description: 'Please enter at least one SKU to create products.',
                variant: 'destructive',
            });
            return null;
        }

        try {
            setIsCreating(true);

            // Optimistic update
            const optimisticResults: CreateProductResult[] = parsedSkus.map(sku => ({
                sku,
                title: `Product ${sku}`,
                status: 'created',
                isActive: true,
            }));
            setResults(optimisticResults);

            // Create the products
            const productResults = await productsApi.createProduct(parsedSkus);
            setResults(productResults);
            return productResults;
        } catch {
            // Revert optimistic update
            setResults([]);
            toast({
                title: 'Error creating products',
                description: 'Failed to create products. Please try again.',
                variant: 'destructive',
            });
            return null;
        } finally {
            setIsCreating(false);
        }
    }, [parsedSkus, toast]);

    const reset = useCallback(() => {
        setSkuInput('');
        setResults([]);
    }, []);

    return {
        skuInput,
        parsedSkus,
        isCreating,
        results,
        handleSkuInputChange,
        createProducts,
        reset,
    };
}

export function getResultStats(results: CreateProductResult[]) {
    return {
        created: results.filter(r => r.status === 'created').length,
        updated: results.filter(r => r.status === 'updated').length,
        failed: results.filter(r => r.status === 'failed').length,
    };
} 