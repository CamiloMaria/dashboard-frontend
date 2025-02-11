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
import { DISABLE_REASONS, type DisableReason } from '@/constants/product';

interface DisableReasonDialogProps {
    open: boolean;
    onConfirm: (reason: DisableReason) => void;
    onCancel: () => void;
}

export function DisableReasonDialog({ open, onConfirm, onCancel }: DisableReasonDialogProps) {
    const [selectedReason, setSelectedReason] = useState<DisableReason | ''>('');

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
                    <AlertDialogTitle>Disable Product</AlertDialogTitle>
                    <AlertDialogDescription>
                        Please select a reason for disabling this product.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <Select
                    value={selectedReason}
                    onValueChange={(value: DisableReason | '') => setSelectedReason(value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select a reason" />
                    </SelectTrigger>
                    <SelectContent>
                        {DISABLE_REASONS.map((reason) => (
                            <SelectItem key={reason} value={reason}>
                                {reason}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <AlertDialogFooter>
                    <Button variant="outline" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={!selectedReason}
                    >
                        Confirm
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}