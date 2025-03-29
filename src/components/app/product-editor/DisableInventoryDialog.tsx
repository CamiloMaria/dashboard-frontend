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
import { Checkbox } from '@/components/ui/checkbox';
import { DISABLE_REASONS, type DisableReason } from '@/constants/product';
import { useTranslation } from 'react-i18next';
import { InfoIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DisableInventoryDialogProps {
    open: boolean;
    shopName: string;
    onConfirm: (reason: DisableReason, manualOverride?: boolean) => void;
    onCancel: () => void;
}

export function DisableInventoryDialog({
    open,
    shopName,
    onConfirm,
    onCancel
}: DisableInventoryDialogProps) {
    const [selectedReason, setSelectedReason] = useState<DisableReason | ''>('');
    const [manualOverride, setManualOverride] = useState(true);
    const { t } = useTranslation();

    useEffect(() => {
        if (!open) {
            setSelectedReason('');
            setManualOverride(true); // Reset to default (true)
        }
    }, [open]);

    const handleConfirm = () => {
        if (selectedReason) {
            onConfirm(selectedReason, manualOverride);
            setSelectedReason('');
            setManualOverride(true);
        }
    };

    const handleCancel = () => {
        onCancel();
        setSelectedReason('');
        setManualOverride(true);
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

                <div className="space-y-4">
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

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="manual-override"
                            checked={manualOverride}
                            onCheckedChange={(checked) => setManualOverride(checked as boolean)}
                        />
                        <div className="grid gap-1.5">
                            <div className="flex items-center gap-1.5">
                                <Label
                                    htmlFor="manual-override"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Manual Override
                                </Label>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <InfoIcon className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="max-w-xs text-xs">
                                                When enabled, this change will be marked as manually overridden and will not be automatically updated by the system.
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Prevent automatic updates from system sync
                            </p>
                        </div>
                    </div>
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