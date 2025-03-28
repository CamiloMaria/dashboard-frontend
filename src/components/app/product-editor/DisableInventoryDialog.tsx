import { useState, useEffect } from 'react';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { DISABLE_REASONS, type DisableReason } from '@/constants/product';
import { useTranslation } from 'react-i18next';

interface DisableInventoryDialogProps {
    open: boolean;
    shopName: string;
    onConfirm: (reason: DisableReason) => void;
    onCancel: () => void;
}

export function DisableInventoryDialog({
    open,
    shopName,
    onConfirm,
    onCancel
}: DisableInventoryDialogProps) {
    const [selectedReason, setSelectedReason] = useState<DisableReason | ''>('');
    const { t } = useTranslation();

    useEffect(() => {
        if (!open) {
            setSelectedReason('');
        }
    }, [open]);

    const handleConfirm = () => {
        if (selectedReason) {
            onConfirm(selectedReason);
            setSelectedReason('');
        }
    };

    const handleCancel = () => {
        onCancel();
        setSelectedReason('');
    };

    return (
        <AlertDialog open={open}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t('products.editor.form.inventory.disable.title')}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('products.editor.form.inventory.disable.description', { shop: shopName })}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-2">
                    <Label>{t('products.editor.form.inventory.disable.reasonLabel')}</Label>
                    <Select
                        value={selectedReason}
                        onValueChange={(value: DisableReason | '') => setSelectedReason(value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={t('products.editor.form.inventory.disable.selectReason')} />
                        </SelectTrigger>
                        <SelectContent>
                            {DISABLE_REASONS.map((reason) => (
                                <SelectItem key={reason} value={reason}>
                                    {reason}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <AlertDialogFooter>
                    <Button variant="outline" onClick={handleCancel}>
                        {t('common.cancel')}
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={!selectedReason}
                    >
                        {t('common.confirm')}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
} 