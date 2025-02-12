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
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { DISABLE_REASONS, type DisableReason } from '@/constants/product';
import { SHOPS } from '@/constants/shops';

interface DisableReasonDialogProps {
    open: boolean;
    onConfirm: (reason: DisableReason, shops: string[]) => void;
    onCancel: () => void;
}

export function DisableReasonDialog({ open, onConfirm, onCancel }: DisableReasonDialogProps) {
    const [selectedReason, setSelectedReason] = useState<DisableReason | ''>('');
    const [selectedShops, setSelectedShops] = useState<string[]>([]);

    useEffect(() => {
        if (!open) {
            setSelectedReason('');
            setSelectedShops([]);
        }
    }, [open]);

    const handleConfirm = () => {
        if (selectedReason && selectedShops.length > 0) {
            onConfirm(selectedReason, selectedShops);
            setSelectedReason('');
            setSelectedShops([]);
        }
    };

    const handleCancel = () => {
        onCancel();
        setSelectedReason('');
        setSelectedShops([]);
    };

    const toggleShop = (shop: string) => {
        setSelectedShops(prev =>
            prev.includes(shop)
                ? prev.filter(s => s !== shop)
                : [...prev, shop]
        );
    };

    const toggleAllShops = () => {
        setSelectedShops(prev =>
            prev.length === SHOPS.length ? [] : [...SHOPS]
        );
    };

    return (
        <AlertDialog open={open}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Disable Product</AlertDialogTitle>
                    <AlertDialogDescription>
                        Please select a reason and the shops where this product should be disabled.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-4">
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

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label>Select Shops</Label>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={toggleAllShops}
                            >
                                {selectedShops.length === SHOPS.length ? 'Deselect All' : 'Select All'}
                            </Button>
                        </div>
                        <div className="grid grid-cols-4 gap-2 border rounded-lg p-2">
                            {SHOPS.map((shop) => (
                                <div key={shop} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={shop}
                                        checked={selectedShops.includes(shop)}
                                        onCheckedChange={() => toggleShop(shop)}
                                    />
                                    <Label htmlFor={shop} className="text-sm">
                                        {shop}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <AlertDialogFooter>
                    <Button variant="outline" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={!selectedReason || selectedShops.length === 0}
                    >
                        Confirm
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}