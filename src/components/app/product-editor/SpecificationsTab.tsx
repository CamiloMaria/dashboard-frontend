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
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from '@/hooks/use-media-query';

interface SpecificationItemProps {
    specification: Specification;
    onEdit: () => void;
    onDelete: () => void;
    isEditing: boolean;
    onSave: (spec: Specification) => void;
    onCancel: () => void;
    isMobile?: boolean;
}

function SpecificationItem({
    specification,
    onEdit,
    onDelete,
    isEditing,
    onSave,
    onCancel,
    isMobile
}: SpecificationItemProps) {
    const [editedTitle, setEditedTitle] = useState(specification.title);
    const [editedDescription, setEditedDescription] = useState(specification.description);
    const [errors, setErrors] = useState<{ title?: string; description?: string }>({});
    const { t } = useTranslation();

    const validateEdit = () => {
        const newErrors: typeof errors = {};
        if (!editedTitle.trim()) newErrors.title = t('validation.required');
        if (!editedDescription.trim()) newErrors.description = t('validation.required');
        if (editedTitle.length > 50) newErrors.title = t('products.editor.form.specifications.titleTooLong');
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
                className={cn(
                    "flex flex-col gap-4 border rounded-lg bg-muted/30",
                    isMobile ? "p-3" : "p-4"
                )}
            >
                <div className={cn(
                    "gap-4",
                    isMobile ? "flex flex-col" : "grid grid-cols-2"
                )}>
                    <div className="space-y-2">
                        <Label htmlFor="edit-title" className={cn(isMobile && "text-sm")}>
                            {t('products.editor.form.specifications.title')}
                        </Label>
                        <Input
                            id="edit-title"
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            className={cn(
                                errors.title ? 'border-destructive' : '',
                                isMobile && "h-8 text-sm"
                            )}
                            aria-invalid={!!errors.title}
                            aria-errormessage={errors.title ? 'title-error' : undefined}
                        />
                        {errors.title && (
                            <p id="title-error" className={cn(
                                "text-destructive",
                                isMobile ? "text-xs" : "text-sm"
                            )}>
                                {errors.title}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="edit-desc" className={cn(isMobile && "text-sm")}>
                            {t('products.editor.form.specifications.description')}
                        </Label>
                        <Input
                            id="edit-desc"
                            value={editedDescription}
                            onChange={(e) => setEditedDescription(e.target.value)}
                            className={cn(
                                errors.description ? 'border-destructive' : '',
                                isMobile && "h-8 text-sm"
                            )}
                            aria-invalid={!!errors.description}
                            aria-errormessage={errors.description ? 'desc-error' : undefined}
                        />
                        {errors.description && (
                            <p id="desc-error" className={cn(
                                "text-destructive",
                                isMobile ? "text-xs" : "text-sm"
                            )}>
                                {errors.description}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onCancel}
                        className={cn(
                            "gap-2",
                            isMobile && "text-xs h-8"
                        )}
                    >
                        <X className={cn(isMobile ? "h-3 w-3" : "h-4 w-4")} />
                        {t('common.cancel')}
                    </Button>
                    <Button
                        size="sm"
                        onClick={handleSave}
                        className={cn(
                            "gap-2",
                            isMobile && "text-xs h-8"
                        )}
                    >
                        <Check className={cn(isMobile ? "h-3 w-3" : "h-4 w-4")} />
                        {t('common.save')}
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
            className={cn(
                "group flex items-center justify-between gap-4 border rounded-lg hover:bg-muted/50 transition-colors",
                isMobile ? "p-3" : "p-4"
            )}
        >
            <div className="flex items-center gap-3 min-w-0">
                <span className="flex-none h-1.5 w-1.5 rounded-full bg-primary/20" />
                <div className="min-w-0 flex-1">
                    <div className={cn(
                        "min-w-0",
                        isMobile ? "flex flex-col gap-1" : "flex items-center gap-2"
                    )}>
                        <p className={cn(
                            "font-medium truncate",
                            isMobile ? "text-xs" : "text-sm"
                        )}>
                            {specification.title}
                        </p>
                        {!isMobile && <span className="flex-none h-1 w-1 rounded-full bg-muted-foreground/30" />}
                        <p className={cn(
                            "text-muted-foreground truncate flex-1",
                            isMobile ? "text-xs" : "text-sm"
                        )}>
                            {specification.description}
                        </p>
                    </div>
                </div>
            </div>
            <div className={cn(
                "flex gap-1 ml-2",
                isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100 transition-opacity"
            )}>
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
                            className={cn(
                                "hover:bg-background",
                                isMobile ? "h-7 w-7" : "h-8 w-8"
                            )}
                            aria-label={t('products.editor.form.specifications.editSpecification')}
                        >
                            <Pencil className={cn(isMobile ? "h-3 w-3" : "h-4 w-4")} />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">{t('products.editor.form.specifications.editSpecification')}</TooltipContent>
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
                            className={cn(
                                "hover:bg-destructive/10 hover:text-destructive",
                                isMobile ? "h-7 w-7" : "h-8 w-8"
                            )}
                            aria-label={t('products.editor.form.specifications.deleteSpecification')}
                        >
                            <Trash2 className={cn(isMobile ? "h-3 w-3" : "h-4 w-4")} />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">{t('products.editor.form.specifications.deleteSpecification')}</TooltipContent>
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
    isMobile?: boolean;
}

function SpecificationForm({
    title,
    description,
    errors,
    onTitleChange,
    onDescriptionChange,
    onSubmit,
    isEditing,
    isMobile
}: SpecificationFormProps) {
    const { t } = useTranslation();

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className={cn(
                "gap-4",
                isMobile ? "flex flex-col" : "grid grid-cols-2"
            )}>
                <div className="space-y-2">
                    <Label htmlFor="spec-title" className={cn(isMobile && "text-sm")}>
                        {t('products.editor.form.specifications.title')}
                        <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="spec-title"
                        placeholder={t('products.editor.form.specifications.titlePlaceholder')}
                        value={title}
                        onChange={(e) => onTitleChange(e.target.value)}
                        className={cn(
                            errors.title ? 'border-destructive' : '',
                            isMobile && "h-8 text-sm"
                        )}
                        aria-invalid={!!errors.title}
                        aria-errormessage={errors.title ? 'spec-title-error' : undefined}
                    />
                    {errors.title && (
                        <p id="spec-title-error" className={cn(
                            "text-destructive",
                            isMobile ? "text-xs" : "text-sm"
                        )}>
                            {errors.title}
                        </p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="spec-desc" className={cn(isMobile && "text-sm")}>
                        {t('products.editor.form.specifications.description')}
                        <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                        id="spec-desc"
                        placeholder={t('products.editor.form.specifications.descriptionPlaceholder')}
                        value={description}
                        onChange={(e) => onDescriptionChange(e.target.value)}
                        className={cn(
                            errors.description ? 'border-destructive' : '',
                            isMobile && "text-sm min-h-[60px]"
                        )}
                        aria-invalid={!!errors.description}
                        aria-errormessage={errors.description ? 'spec-desc-error' : undefined}
                    />
                    {errors.description && (
                        <p id="spec-desc-error" className={cn(
                            "text-destructive",
                            isMobile ? "text-xs" : "text-sm"
                        )}>
                            {errors.description}
                        </p>
                    )}
                </div>
            </div>

            <Button
                onClick={onSubmit}
                disabled={!title || !description}
                className={cn(
                    "w-full gap-2",
                    isMobile && "h-9 text-sm"
                )}
            >
                <Plus className={cn(isMobile ? "h-3 w-3" : "h-4 w-4")} />
                {isEditing ? t('products.editor.form.specifications.updateSpecification') : t('products.editor.form.specifications.addSpecification')}
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
    const { t } = useTranslation();
    const isMobile = useMediaQuery('(max-width: 640px)');

    const validateInputs = () => {
        const errors: typeof inputErrors = {};
        if (!newTitle.trim()) errors.title = t('validation.required');
        if (!newDescription.trim()) errors.description = t('validation.required');
        if (newTitle.length > 50) errors.title = t('products.editor.form.specifications.titleTooLong');
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
        if (deleteIndex !== null) {
            const updated = [...specifications];
            updated.splice(deleteIndex, 1);
            onSpecificationsChange(updated);
            setDeleteIndex(null);
            toast({
                title: 'Specification deleted',
                description: 'The specification has been deleted successfully.',
            });
        }
    };

    const handleCancelDelete = () => {
        setDeleteIndex(null);
    };

    return (
        <>
            <Card>
                <CardHeader className={cn(
                    isMobile ? "p-3 pb-2" : "pb-3"
                )}>
                    <CardTitle className={cn(isMobile && "text-base")}>
                        {t('products.editor.form.specifications.title')}
                    </CardTitle>
                </CardHeader>
                <CardContent className={cn(
                    isMobile ? "p-3 space-y-4" : "space-y-6"
                )}>
                    {specifications.length > 0 ? (
                        <div className="relative">
                            <div className={cn(
                                "grid gap-2",
                                specifications.length > 4 && [
                                    "overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-muted/50 hover:scrollbar-thumb-border/80",
                                    "pr-2 -mr-2 pb-6"
                                ],
                                isMobile ? "h-[240px]" : "h-[280px]"
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
                                            isMobile={isMobile}
                                        />
                                    ))}
                                </AnimatePresence>
                            </div>
                            {specifications.length > 4 && (
                                <div className="absolute bottom-0 left-0 right-2 h-6 bg-gradient-to-t from-background to-transparent pointer-events-none" />
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <div className="rounded-full bg-muted p-3 mb-3">
                                <Plus className={cn(
                                    "text-muted-foreground",
                                    isMobile ? "h-5 w-5" : "h-6 w-6"
                                )} />
                            </div>
                            <h3 className={cn(
                                "font-medium",
                                isMobile ? "text-sm" : "text-base"
                            )}>
                                {t('products.editor.form.specifications.noSpecifications')}
                            </h3>
                            <p className={cn(
                                "text-muted-foreground max-w-[420px] mt-1.5",
                                isMobile ? "text-xs" : "text-sm"
                            )}>
                                {t('products.editor.form.specifications.noSpecificationsDescription')}
                            </p>
                        </div>
                    )}

                    <div className={cn(
                        "border rounded-lg",
                        isMobile ? "p-3" : "p-4"
                    )}>
                        <h3 className={cn(
                            "font-medium mb-4",
                            isMobile ? "text-sm" : "text-base"
                        )}>
                            {t('products.editor.form.specifications.addNew')}
                        </h3>
                        <SpecificationForm
                            title={newTitle}
                            description={newDescription}
                            errors={inputErrors}
                            onTitleChange={setNewTitle}
                            onDescriptionChange={setNewDescription}
                            onSubmit={handleAddSpecification}
                            isEditing={false}
                            isMobile={isMobile}
                        />
                    </div>
                </CardContent>
            </Card>

            <ConfirmationDialog
                open={deleteIndex !== null}
                title={t('products.editor.form.specifications.deleteDialog.title')}
                description={t('products.editor.form.specifications.deleteDialog.description')}
                confirmText={t('common.delete')}
                confirmVariant="destructive"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
        </>
    );
} 