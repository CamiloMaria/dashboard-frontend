import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Wand2, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ConfirmationDialog } from '@/components/app/ConfirmationDialog';
import { useTranslation } from 'react-i18next';
import { productsApi } from '@/api/products';

interface KeywordsTabProps {
    keywords: string[];
    title: string;
    category: string;
    onKeywordsChange: (keywords: string[]) => void;
}

export function KeywordsTab({ keywords, title, category, onKeywordsChange }: KeywordsTabProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [showGenerateConfirm, setShowGenerateConfirm] = useState(false);
    const [newKeyword, setNewKeyword] = useState('');
    const { toast } = useToast();
    const { t } = useTranslation();

    const handleGenerateClick = () => {
        setShowGenerateConfirm(true);
    };

    const handleGenerateConfirm = async () => {
        try {
            setIsGenerating(true);
            const generatedKeywords = await productsApi.generateKeywords(title, category);
            // Merge existing and new keywords, remove duplicates
            const updatedKeywords = [...new Set([...keywords, ...generatedKeywords])];
            onKeywordsChange(updatedKeywords);
            toast({
                title: t('products.editor.form.keywords.messages.generated'),
                description: t('products.editor.form.keywords.messages.generatedDescription'),
            });
        } catch {
            toast({
                title: t('products.editor.form.keywords.messages.error'),
                description: t('products.editor.form.keywords.messages.errorDescription'),
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

    const handleRemoveKeyword = (keywordToRemove: string) => {
        const updatedKeywords = keywords.filter(k => k !== keywordToRemove);
        onKeywordsChange(updatedKeywords);
    };

    return (
        <>
            <Card className="flex flex-col h-[400px]">
                <CardHeader className="pb-2 flex-none">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <CardTitle>{t('products.editor.form.keywords.title')}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                {t('products.editor.form.keywords.subtitle')}
                            </p>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleGenerateClick}
                            disabled={isGenerating}
                            className="gap-2"
                        >
                            <Wand2 className="h-4 w-4" />
                            {isGenerating ? t('products.editor.form.keywords.generating') : t('products.editor.form.keywords.generateButton')}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col space-y-3 min-h-0">
                    <div className="flex gap-2">
                        <Input
                            placeholder={t('products.editor.form.keywords.addPlaceholder')}
                            value={newKeyword}
                            onChange={(e) => setNewKeyword(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    if (newKeyword.trim()) {
                                        const updatedKeywords = [...new Set([...keywords, newKeyword.trim().toLowerCase()])];
                                        onKeywordsChange(updatedKeywords);
                                        setNewKeyword('');
                                    }
                                }
                            }}
                            className="flex-1"
                        />
                        <Button
                            type="button"
                            onClick={() => {
                                if (newKeyword.trim()) {
                                    const updatedKeywords = [...new Set([...keywords, newKeyword.trim().toLowerCase()])];
                                    onKeywordsChange(updatedKeywords);
                                    setNewKeyword('');
                                }
                            }}
                        >
                            {t('products.editor.form.keywords.addButton')}
                        </Button>
                    </div>
                    <div className="border rounded-md flex-1 overflow-hidden">
                        <div className="p-3 h-full overflow-y-auto">
                            <div className="flex flex-wrap gap-2">
                                {keywords.map((keyword, index) => (
                                    <Badge
                                        key={`${keyword}-${index}`}
                                        variant="secondary"
                                        className="px-3 py-1.5 text-sm flex items-center gap-2 hover:bg-secondary/80"
                                    >
                                        {keyword}
                                        <button
                                            onClick={() => handleRemoveKeyword(keyword)}
                                            className="text-muted-foreground hover:text-foreground transition-colors"
                                            type="button"
                                            title={t('products.editor.form.keywords.removeTooltip')}
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <ConfirmationDialog
                open={showGenerateConfirm}
                title={t('products.editor.form.keywords.generateDialog.title')}
                description={t('products.editor.form.keywords.generateDialog.description')}
                confirmText={t('products.editor.form.keywords.generateDialog.confirmText')}
                isLoading={isGenerating}
                onConfirm={handleGenerateConfirm}
                onCancel={handleGenerateCancel}
            />
        </>
    );
}
