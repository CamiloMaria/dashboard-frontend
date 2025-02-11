import { Plus, Trash2, Pencil, X, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { type Specification } from '@/types/product';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { ConfirmationDialog } from '@/components/app/ConfirmationDialog';

interface SpecificationItemProps {
    specification: Specification;
    onEdit: () => void;
    onDelete: () => void;
    isEditing: boolean;
    onSave: (spec: Specification) => void;
    onCancel: () => void;
}

function SpecificationItem({
    specification,
    onEdit,
    onDelete,
    isEditing,
    onSave,
    onCancel
}: SpecificationItemProps) {
    const [editedTitle, setEditedTitle] = useState(specification.title);
    const [editedDescription, setEditedDescription] = useState(specification.description);
    const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

    const validateEdit = () => {
        const newErrors: typeof errors = {};
        if (!editedTitle.trim()) newErrors.title = 'Title is required';
        if (!editedDescription.trim()) newErrors.description = 'Description is required';
        if (editedTitle.length > 50) newErrors.title = 'Title too long (max 50 chars)';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validateEdit()) return;
        onSave({
            title: editedTitle.trim(),
            description: editedDescription.trim()
        });
    };

    if (isEditing) {
        return (
            <motion.div
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                className="flex flex-col gap-4 p-4 border rounded-lg bg-muted/30"
            >
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-title">Title</Label>
                        <Input
                            id="edit-title"
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            className={errors.title ? 'border-destructive' : ''}
                            aria-invalid={!!errors.title}
                            aria-errormessage={errors.title ? 'title-error' : undefined}
                        />
                        {errors.title && (
                            <p id="title-error" className="text-sm text-destructive">{errors.title}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="edit-desc">Description</Label>
                        <Input
                            id="edit-desc"
                            value={editedDescription}
                            onChange={(e) => setEditedDescription(e.target.value)}
                            className={errors.description ? 'border-destructive' : ''}
                            aria-invalid={!!errors.description}
                            aria-errormessage={errors.description ? 'desc-error' : undefined}
                        />
                        {errors.description && (
                            <p id="desc-error" className="text-sm text-destructive">{errors.description}</p>
                        )}
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onCancel}
                        className="gap-2"
                    >
                        <X className="h-4 w-4" />
                        Cancel
                    </Button>
                    <Button
                        size="sm"
                        onClick={handleSave}
                        className="gap-2"
                    >
                        <Check className="h-4 w-4" />
                        Save
                    </Button>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="group flex items-center justify-between gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
        >
            <div className="flex items-center gap-3 min-w-0">
                <span className="flex-none h-1.5 w-1.5 rounded-full bg-primary/20" />
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 min-w-0">
                        <p className="font-medium text-sm truncate">
                            {specification.title}
                        </p>
                        <span className="flex-none h-1 w-1 rounded-full bg-muted-foreground/30" />
                        <p className="text-sm text-muted-foreground truncate flex-1">
                            {specification.description}
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onEdit();
                            }}
                            type="button"
                            className="h-8 w-8 hover:bg-background"
                            aria-label="Edit specification"
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">Edit specification</TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onDelete();
                            }}
                            type="button"
                            className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                            aria-label="Delete specification"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">Delete specification</TooltipContent>
                </Tooltip>
            </div>
        </motion.div>
    );
}

interface SpecificationFormProps {
    title: string;
    description: string;
    errors: { title?: string; description?: string };
    onTitleChange: (value: string) => void;
    onDescriptionChange: (value: string) => void;
    onSubmit: () => void;
    isEditing: boolean;
}

function SpecificationForm({
    title,
    description,
    errors,
    onTitleChange,
    onDescriptionChange,
    onSubmit,
    isEditing,
}: SpecificationFormProps) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="spec-title">
                        Specification Title
                        <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="spec-title"
                        placeholder="e.g. Material, Weight, Dimensions"
                        value={title}
                        onChange={(e) => onTitleChange(e.target.value)}
                        className={errors.title ? 'border-destructive' : ''}
                        aria-invalid={!!errors.title}
                        aria-errormessage={errors.title ? 'spec-title-error' : undefined}
                    />
                    {errors.title && (
                        <p id="spec-title-error" className="text-sm text-destructive">{errors.title}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="spec-desc">
                        Specification Description
                        <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                        id="spec-desc"
                        placeholder="e.g. 100% Cotton, 1.5kg, 10x20x30cm"
                        value={description}
                        onChange={(e) => onDescriptionChange(e.target.value)}
                        className={errors.description ? 'border-destructive' : ''}
                        aria-invalid={!!errors.description}
                        aria-errormessage={errors.description ? 'spec-desc-error' : undefined}
                    />
                    {errors.description && (
                        <p id="spec-desc-error" className="text-sm text-destructive">{errors.description}</p>
                    )}
                </div>
            </div>

            <Button
                onClick={onSubmit}
                disabled={!title || !description}
                className="w-full gap-2"
            >
                <Plus className="h-4 w-4" />
                {isEditing ? 'Update Specification' : 'Add Specification'}
            </Button>
        </div>
    );
}

interface SpecificationsTabProps {
    specifications: Specification[];
    onSpecificationsChange: (specifications: Specification[]) => void;
}

export function SpecificationsTab({ specifications, onSpecificationsChange }: SpecificationsTabProps) {
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
    const [inputErrors, setInputErrors] = useState<{ title?: string; description?: string }>({});
    const { toast } = useToast();

    const validateInputs = () => {
        const errors: typeof inputErrors = {};
        if (!newTitle.trim()) errors.title = 'Title is required';
        if (!newDescription.trim()) errors.description = 'Description is required';
        if (newTitle.length > 50) errors.title = 'Title too long (max 50 chars)';
        setInputErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleAddSpecification = () => {
        if (!validateInputs()) return;

        const newSpec = { title: newTitle.trim(), description: newDescription.trim() };
        onSpecificationsChange([...specifications, newSpec]);
        setNewTitle('');
        setNewDescription('');
        toast({
            title: 'Specification added',
            description: 'The specification has been added successfully.',
        });
    };

    const handleEditSpecification = (index: number) => {
        setEditIndex(index);
    };

    const handleSaveEdit = (index: number, updatedSpec: Specification) => {
        const updated = [...specifications];
        updated[index] = updatedSpec;
        onSpecificationsChange(updated);
        setEditIndex(null);
        toast({
            title: 'Specification updated',
            description: 'The specification has been updated successfully.',
        });
    };

    const handleCancelEdit = () => {
        setEditIndex(null);
    };

    const handleDeleteSpecification = (index: number) => {
        setDeleteIndex(index);
    };

    const handleConfirmDelete = () => {
        if (deleteIndex === null) return;
        onSpecificationsChange(specifications.filter((_, i) => i !== deleteIndex));
        setDeleteIndex(null);
        toast({
            title: 'Specification deleted',
            description: 'The specification has been deleted successfully.',
            variant: 'default',
        });
    };

    const handleCancelDelete = () => {
        setDeleteIndex(null);
    };

    return (
        <>
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <CardTitle>Product Specifications</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Add or modify product specifications like dimensions, materials, etc.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{specifications.length}</span>
                            <span className="text-sm text-muted-foreground">specifications</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {specifications.length > 0 ? (
                        <div className="relative">
                            <div className={cn(
                                "grid gap-2",
                                specifications.length > 4 && [
                                    "h-[280px] overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-muted/50 hover:scrollbar-thumb-border/80",
                                    "pr-2 -mr-2 pb-6"
                                ]
                            )}>
                                <AnimatePresence>
                                    {specifications.map((spec, index) => (
                                        <SpecificationItem
                                            key={index}
                                            specification={spec}
                                            onEdit={() => handleEditSpecification(index)}
                                            onDelete={() => handleDeleteSpecification(index)}
                                            isEditing={editIndex === index}
                                            onSave={(updatedSpec) => handleSaveEdit(index, updatedSpec)}
                                            onCancel={handleCancelEdit}
                                        />
                                    ))}
                                </AnimatePresence>
                            </div>
                            {specifications.length > 4 && (
                                <div className="absolute bottom-0 left-0 right-2 h-6 bg-gradient-to-t from-background to-transparent pointer-events-none" />
                            )}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-8 text-center bg-muted/30 rounded-lg border border-dashed border-border"
                        >
                            <div className="text-muted-foreground mb-2">
                                <Plus className="h-8 w-8" />
                            </div>
                            <p className="text-sm text-muted-foreground">No specifications added yet</p>
                            <p className="text-xs text-muted-foreground/70">Add specifications using the form below</p>
                        </motion.div>
                    )}

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Add New Specification
                            </span>
                        </div>
                    </div>

                    <SpecificationForm
                        title={newTitle}
                        description={newDescription}
                        errors={inputErrors}
                        onTitleChange={setNewTitle}
                        onDescriptionChange={setNewDescription}
                        onSubmit={handleAddSpecification}
                        isEditing={false}
                    />
                </CardContent>
            </Card>

            <ConfirmationDialog
                open={deleteIndex !== null}
                title="Delete Specification"
                description="Are you sure you want to delete this specification? This action cannot be undone."
                confirmText="Delete"
                confirmVariant="destructive"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
        </>
    );
} 