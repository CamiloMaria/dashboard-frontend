import { Loader2 } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTranslation } from 'react-i18next';

export interface ConfirmationDialogProps {
    open: boolean;
    title: string;
    description: string;
    isLoading?: boolean;
    confirmText?: string;
    cancelText?: string;
    confirmVariant?: 'default' | 'destructive';
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmationDialog({
    open,
    title,
    description,
    isLoading = false,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    confirmVariant = 'default',
    onConfirm,
    onCancel,
}: ConfirmationDialogProps) {
    const { t } = useTranslation();

    return (
        <AlertDialog open={open} onOpenChange={() => onCancel()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>{cancelText}</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className={confirmVariant === 'destructive' ? 'bg-red-600 hover:bg-red-700 focus:ring-red-600' : ''}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t('common.loading')}
                            </>
                        ) : (
                            confirmText
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
} 