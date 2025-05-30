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
                        Please select a reason where this product should be disabled.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-2">
                    <Label>Disable Reason</Label>
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
                </div>

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