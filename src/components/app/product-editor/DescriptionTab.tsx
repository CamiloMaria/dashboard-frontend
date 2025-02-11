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

interface DescriptionTabProps {
    description: string | undefined;
    onDescriptionChange: (description: string) => void;
}

// Mock API function - replace with actual API call later
const generateDescription = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `
        <h2>Product Overview</h2>
        <p>This high-quality product is designed to meet your needs with premium materials and expert craftsmanship.</p>
        <ul>
            <li>Premium quality materials</li>
            <li>Expert craftsmanship</li>
            <li>Durable construction</li>
        </ul>
        <h3>Features & Benefits</h3>
        <p>Experience the difference with our innovative features and lasting benefits.</p>
    `;
};

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

export function DescriptionTab({ description, onDescriptionChange }: DescriptionTabProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [showGenerateConfirm, setShowGenerateConfirm] = useState(false);
    const { toast } = useToast();

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
            title: 'Description saved',
            description: 'The product description has been updated successfully.',
        });
    };

    const handleGenerateClick = () => {
        setShowGenerateConfirm(true);
    };

    const handleGenerateConfirm = async () => {
        if (!editor) return;
        try {
            setIsGenerating(true);
            const newDescription = await generateDescription();
            editor.commands.setContent(newDescription);
            onDescriptionChange(newDescription);
            toast({
                title: 'Description generated',
                description: 'A new product description has been generated successfully.',
            });
        } catch {
            toast({
                title: 'Error',
                description: 'Failed to generate description. Please try again.',
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
                            <CardTitle>Product Description</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Edit the product description using the rich text editor
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
                                {isGenerating ? 'Generating...' : 'Generate Description'}
                            </Button>
                            <Button
                                onClick={() => handleSave()}
                                type="button"
                            >
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col min-h-0">
                    <div className="border-b pb-2 flex flex-wrap gap-0.5 flex-none">
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            isActive={editor.isActive('bold')}
                            title="Bold"
                        >
                            <Bold className="h-4 w-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            isActive={editor.isActive('italic')}
                            title="Italic"
                        >
                            <Italic className="h-4 w-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleUnderline().run()}
                            isActive={editor.isActive('underline')}
                            title="Underline"
                        >
                            <UnderlineIcon className="h-4 w-4" />
                        </ToolbarButton>
                        <div className="mx-2 border-r" />
                        <ToolbarButton
                            onClick={() => editor.chain().focus().setTextAlign('left').run()}
                            isActive={editor.isActive({ textAlign: 'left' })}
                            title="Align left"
                        >
                            <AlignLeft className="h-4 w-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().setTextAlign('center').run()}
                            isActive={editor.isActive({ textAlign: 'center' })}
                            title="Align center"
                        >
                            <AlignCenter className="h-4 w-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().setTextAlign('right').run()}
                            isActive={editor.isActive({ textAlign: 'right' })}
                            title="Align right"
                        >
                            <AlignRight className="h-4 w-4" />
                        </ToolbarButton>
                        <div className="mx-2 border-r" />
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                            isActive={editor.isActive('bulletList')}
                            title="Bullet list"
                        >
                            <List className="h-4 w-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleOrderedList().run()}
                            isActive={editor.isActive('orderedList')}
                            title="Numbered list"
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
                title="Generate Description"
                description="This will generate a new product description based on the product information. The current description will be replaced. Do you want to continue?"
                confirmText="Generate"
                isLoading={isGenerating}
                onConfirm={handleGenerateConfirm}
                onCancel={handleGenerateCancel}
            />
        </>
    );
} 