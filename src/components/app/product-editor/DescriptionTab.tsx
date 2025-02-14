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
}

function ToolbarButton({ onClick, isActive, disabled, children, title }: ToolbarButtonProps) {
    return (
        <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClick}
            className={`h-8 w-8 p-0 hover:bg-muted ${isActive ? 'bg-muted' : ''}`}
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
                class: 'prose prose-sm max-w-none focus:outline-none p-4',
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
            const newDescription = await productsApi.generateDescription(title);
            editor.commands.setContent(newDescription);
            onDescriptionChange(newDescription);
            toast({
                title: t('products.editor.form.description.messages.generated'),
                description: t('products.editor.form.description.messages.generatedDescription'),
            });
        } catch {
            toast({
                title: t('products.editor.form.description.messages.error'),
                description: t('products.editor.form.description.messages.errorDescription'),
                variant: 'destructive',
            });
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
            <Card className="h-[calc(100vh-12rem)] flex flex-col">
                <CardHeader className="pb-3 flex-none">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <CardTitle>{t('products.editor.form.description.title')}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                {t('products.editor.form.description.subtitle')}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={handleGenerateClick}
                                disabled={isGenerating}
                                className="gap-2"
                                type="button"
                            >
                                <Wand2 className="h-4 w-4" />
                                {isGenerating
                                    ? t('products.editor.form.description.generating')
                                    : t('products.editor.form.description.generateButton')}
                            </Button>
                            <Button
                                onClick={() => handleSave()}
                                type="button"
                            >
                                {t('products.editor.form.description.saveChanges')}
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col min-h-0">
                    <div className="border-b pb-2 flex flex-wrap gap-0.5 flex-none">
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            isActive={editor.isActive('bold')}
                            title={t('products.editor.form.description.toolbar.bold')}
                        >
                            <Bold className="h-4 w-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            isActive={editor.isActive('italic')}
                            title={t('products.editor.form.description.toolbar.italic')}
                        >
                            <Italic className="h-4 w-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleUnderline().run()}
                            isActive={editor.isActive('underline')}
                            title={t('products.editor.form.description.toolbar.underline')}
                        >
                            <UnderlineIcon className="h-4 w-4" />
                        </ToolbarButton>
                        <div className="mx-2 border-r" />
                        <ToolbarButton
                            onClick={() => editor.chain().focus().setTextAlign('left').run()}
                            isActive={editor.isActive({ textAlign: 'left' })}
                            title={t('products.editor.form.description.toolbar.alignLeft')}
                        >
                            <AlignLeft className="h-4 w-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().setTextAlign('center').run()}
                            isActive={editor.isActive({ textAlign: 'center' })}
                            title={t('products.editor.form.description.toolbar.alignCenter')}
                        >
                            <AlignCenter className="h-4 w-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().setTextAlign('right').run()}
                            isActive={editor.isActive({ textAlign: 'right' })}
                            title={t('products.editor.form.description.toolbar.alignRight')}
                        >
                            <AlignRight className="h-4 w-4" />
                        </ToolbarButton>
                        <div className="mx-2 border-r" />
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                            isActive={editor.isActive('bulletList')}
                            title={t('products.editor.form.description.toolbar.bulletList')}
                        >
                            <List className="h-4 w-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleOrderedList().run()}
                            isActive={editor.isActive('orderedList')}
                            title={t('products.editor.form.description.toolbar.numberedList')}
                        >
                            <ListOrdered className="h-4 w-4" />
                        </ToolbarButton>
                    </div>
                    <div className="border rounded-md mt-4 flex-1 overflow-y-auto min-h-0">
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