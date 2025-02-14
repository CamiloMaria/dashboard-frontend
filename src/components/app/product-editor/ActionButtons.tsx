import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ActionButtonsProps {
    isLoading: boolean;
    isPending: boolean;
    onCancel: () => void;
}

export function ActionButtons({ isLoading, isPending, onCancel }: ActionButtonsProps) {
    return (
        <div className="flex justify-end gap-4">
            <Button
                variant="outline"
                onClick={onCancel}
                type="button"
                disabled={isPending}
            >
                Cancel
            </Button>
            <Button
                type="submit"
                disabled={isLoading || isPending}
            >
                {isPending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        'Updating...'
                    </>
                ) : (
                    'Update Product'
                )}
            </Button>
        </div>
    );
} 