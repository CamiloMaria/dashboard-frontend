import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ConfirmationDialog } from '@/components/app/ConfirmationDialog';
import {
    Wand2,
    Bold,
    Italic,
    Underline as UnderlineIcon,
    AlignLeft,
    AlignCenter,
    AlignRight,
    List,
    ListOrdered,
} from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import UnderlineExtension from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { useTranslation } from 'react-i18next';
import { productsApi } from '@/api/products';
import { AxiosError } from 'axios';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';

interface DescriptionTabProps {
    description: string | undefined;
    title: string;
    onDescriptionChange: (description: string) => void;
}

interface ToolbarButtonProps {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title: string;
    isMobile?: boolean;
}

function ToolbarButton({ onClick, isActive, disabled, children, title, isMobile }: ToolbarButtonProps) {
    return (
        <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClick}
            className={cn(
                `hover:bg-muted ${isActive ? 'bg-muted' : ''}`,
                isMobile ? "h-7 w-7 p-0" : "h-8 w-8 p-0"
            )}
            disabled={disabled}
            title={title}
        >
            {children}
        </Button>
    );
}

export function DescriptionTab({ description, title, onDescriptionChange }: DescriptionTabProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [showGenerateConfirm, setShowGenerateConfirm] = useState(false);
    const { toast } = useToast();
    const { t } = useTranslation();
    const isMobile = useMediaQuery('(max-width: 640px)');

    const editor = useEditor({
        extensions: [
            StarterKit,
            UnderlineExtension,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        content: description || '',
        editorProps: {
            attributes: {
                class: cn(
                    'prose max-w-none focus:outline-none',
                    isMobile ? 'prose-xs p-2' : 'prose-sm p-4'
                ),
            },
        },
    });

    useEffect(() => {
        if (editor && description) {
            editor.commands.setContent(description);
        }
    }, [editor, description]);

    const handleSave = () => {
        if (!editor) return;
        const html = editor.getHTML();
        onDescriptionChange(html);
        toast({
            title: t('products.editor.form.description.messages.saved'),
            description: t('products.editor.form.description.messages.savedDescription'),
        });
    };

    const handleGenerateClick = () => {
        setShowGenerateConfirm(true);
    };

    const handleGenerateConfirm = async () => {
        if (!editor) return;
        try {
            setIsGenerating(true);
            const response = await productsApi.generateDescription(title);
            editor.commands.setContent(response.data.description);
            onDescriptionChange(response.data.description);
            toast({
                title: t('products.editor.form.description.messages.generated'),
                description: t('products.editor.form.description.messages.generatedDescription'),
            });
        } catch (error) {
            if (error instanceof AxiosError && error.response?.status === 400) {
                toast({
                    title: t('products.editor.form.description.messages.error'),
                    description: t('products.editor.form.description.messages.error400'),
                    variant: 'destructive',
                });
            } else {
                toast({
                    title: t('products.editor.form.description.messages.error'),
                    description: t('products.editor.form.description.messages.errorDescription'),
                    variant: 'destructive',
                });
            }
        } finally {
            setIsGenerating(false);
            setShowGenerateConfirm(false);
        }
    };

    const handleGenerateCancel = () => {
        setShowGenerateConfirm(false);
    };

    if (!editor) {
        return null;
    }

    return (
        <>
            <Card className={cn(
                "flex flex-col",
                isMobile ? "h-[calc(100vh-10rem)]" : "h-[calc(100vh-12rem)]"
            )}>
                <CardHeader className={cn(
                    "flex-none",
                    isMobile ? "p-3 pb-2" : "pb-3"
                )}>
                    <div className={cn(
                        isMobile ? "flex flex-col gap-2" : "flex items-center justify-between"
                    )}>
                        <div className="space-y-1">
                            <CardTitle className={cn(isMobile && "text-base")}>
                                {t('products.editor.form.description.title')}
                            </CardTitle>
                            <p className={cn(
                                "text-muted-foreground",
                                isMobile ? "text-xs" : "text-sm"
                            )}>
                                {t('products.editor.form.description.subtitle')}
                            </p>
                        </div>
                        <div className={cn(
                            "flex",
                            isMobile ? "w-full mt-1" : "gap-2"
                        )}>
                            <Button
                                variant="outline"
                                onClick={handleGenerateClick}
                                disabled={isGenerating}
                                className={cn(
                                    "gap-2",
                                    isMobile ? "flex-1 h-8 text-xs" : ""
                                )}
                                type="button"
                            >
                                <Wand2 className={cn(isMobile ? "h-3 w-3" : "h-4 w-4")} />
                                {isGenerating
                                    ? t('products.editor.form.description.generating')
                                    : t('products.editor.form.description.generateButton')}
                            </Button>
                            <Button
                                onClick={() => handleSave()}
                                type="button"
                                className={cn(
                                    isMobile ? "flex-1 h-8 text-xs ml-2" : ""
                                )}
                            >
                                {t('products.editor.form.description.saveChanges')}
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col min-h-0">
                    <div className={cn(
                        "border-b pb-2 flex flex-wrap gap-0.5 flex-none",
                        isMobile && "overflow-x-auto"
                    )}>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            isActive={editor.isActive('bold')}
                            title={t('products.editor.form.description.toolbar.bold')}
                            isMobile={isMobile}
                        >
                            <Bold className={cn(isMobile ? "h-3.5 w-3.5" : "h-4 w-4")} />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            isActive={editor.isActive('italic')}
                            title={t('products.editor.form.description.toolbar.italic')}
                            isMobile={isMobile}
                        >
                            <Italic className={cn(isMobile ? "h-3.5 w-3.5" : "h-4 w-4")} />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleUnderline().run()}
                            isActive={editor.isActive('underline')}
                            title={t('products.editor.form.description.toolbar.underline')}
                            isMobile={isMobile}
                        >
                            <UnderlineIcon className={cn(isMobile ? "h-3.5 w-3.5" : "h-4 w-4")} />
                        </ToolbarButton>
                        <div className="mx-2 border-r" />
                        <ToolbarButton
                            onClick={() => editor.chain().focus().setTextAlign('left').run()}
                            isActive={editor.isActive({ textAlign: 'left' })}
                            title={t('products.editor.form.description.toolbar.alignLeft')}
                            isMobile={isMobile}
                        >
                            <AlignLeft className={cn(isMobile ? "h-3.5 w-3.5" : "h-4 w-4")} />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().setTextAlign('center').run()}
                            isActive={editor.isActive({ textAlign: 'center' })}
                            title={t('products.editor.form.description.toolbar.alignCenter')}
                            isMobile={isMobile}
                        >
                            <AlignCenter className={cn(isMobile ? "h-3.5 w-3.5" : "h-4 w-4")} />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().setTextAlign('right').run()}
                            isActive={editor.isActive({ textAlign: 'right' })}
                            title={t('products.editor.form.description.toolbar.alignRight')}
                            isMobile={isMobile}
                        >
                            <AlignRight className={cn(isMobile ? "h-3.5 w-3.5" : "h-4 w-4")} />
                        </ToolbarButton>
                        <div className="mx-2 border-r" />
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                            isActive={editor.isActive('bulletList')}
                            title={t('products.editor.form.description.toolbar.bulletList')}
                            isMobile={isMobile}
                        >
                            <List className={cn(isMobile ? "h-3.5 w-3.5" : "h-4 w-4")} />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleOrderedList().run()}
                            isActive={editor.isActive('orderedList')}
                            title={t('products.editor.form.description.toolbar.numberedList')}
                            isMobile={isMobile}
                        >
                            <ListOrdered className={cn(isMobile ? "h-3.5 w-3.5" : "h-4 w-4")} />
                        </ToolbarButton>
                    </div>
                    <div className={cn(
                        "border rounded-md mt-4 flex-1 overflow-y-auto min-h-0",
                        isMobile && "mt-2"
                    )}>
                        <EditorContent editor={editor} className="h-full" />
                    </div>
                </CardContent>
            </Card>

            <ConfirmationDialog
                open={showGenerateConfirm}
                title={t('products.editor.form.description.generateDialog.title')}
                description={t('products.editor.form.description.generateDialog.description')}
                confirmText={t('products.editor.form.description.generateDialog.confirmText')}
                isLoading={isGenerating}
                onConfirm={handleGenerateConfirm}
                onCancel={handleGenerateCancel}
            />
        </>
    );
} 