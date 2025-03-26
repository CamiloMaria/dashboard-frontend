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
import { AxiosError } from 'axios';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';

interface KeywordsTabProps {
    keywords: string[];
    sku: string;
    onKeywordsChange: (keywords: string[]) => void;
}

export function KeywordsTab({ keywords, sku, onKeywordsChange }: KeywordsTabProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [showGenerateConfirm, setShowGenerateConfirm] = useState(false);
    const [newKeyword, setNewKeyword] = useState('');
    const { toast } = useToast();
    const { t } = useTranslation();
    const isMobile = useMediaQuery('(max-width: 640px)');

    const handleGenerateClick = () => {
        setShowGenerateConfirm(true);
    };

    const handleGenerateConfirm = async () => {
        try {
            setIsGenerating(true);
            const response = await productsApi.generateKeywords(sku);
            // Merge existing and new keywords, remove duplicates
            onKeywordsChange(response.data.keywords);
            toast({
                title: t('products.editor.form.keywords.messages.generated'),
                description: t('products.editor.form.keywords.messages.generatedDescription'),
            });
        } catch (error) {
            if (error instanceof AxiosError && error.response?.status === 400) {
                toast({
                    title: t('products.editor.form.keywords.messages.error'),
                    description: t('products.editor.form.keywords.messages.error400'),
                    variant: 'destructive',
                });
            } else {
                toast({
                    title: t('products.editor.form.keywords.messages.error'),
                    description: t('products.editor.form.keywords.messages.errorDescription'),
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

    const handleRemoveKeyword = (keywordToRemove: string) => {
        const updatedKeywords = keywords.filter(k => k !== keywordToRemove);
        onKeywordsChange(updatedKeywords);
    };

    const handleAddKeyword = () => {
        if (newKeyword.trim()) {
            const updatedKeywords = [...new Set([...keywords, newKeyword.trim().toLowerCase()])];
            onKeywordsChange(updatedKeywords);
            setNewKeyword('');
        }
    };

    return (
        <>
            <Card className={cn(
                "flex flex-col",
                isMobile ? "h-[350px]" : "h-[400px]"
            )}>
                <CardHeader className={cn(
                    "flex-none",
                    isMobile ? "p-3 pb-2" : "pb-2"
                )}>
                    <div className={cn(
                        isMobile ? "flex flex-col gap-2" : "flex items-center justify-between"
                    )}>
                        <div className="space-y-0.5">
                            <CardTitle className={cn(isMobile && "text-base")}>
                                {t('products.editor.form.keywords.title')}
                            </CardTitle>
                            <p className={cn(
                                "text-muted-foreground",
                                isMobile ? "text-xs" : "text-sm"
                            )}>
                                {t('products.editor.form.keywords.subtitle')}
                            </p>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleGenerateClick}
                            disabled={isGenerating}
                            className={cn(
                                "gap-2",
                                isMobile ? "w-full h-8 text-xs mt-1" : ""
                            )}
                        >
                            <Wand2 className={cn(isMobile ? "h-3 w-3" : "h-4 w-4")} />
                            {isGenerating ? t('products.editor.form.keywords.generating') : t('products.editor.form.keywords.generateButton')}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className={cn(
                    "flex-1 flex flex-col space-y-3 min-h-0",
                    isMobile && "p-3"
                )}>
                    <div className={cn(
                        "flex",
                        isMobile ? "flex-col gap-2" : "gap-2"
                    )}>
                        <Input
                            placeholder={t('products.editor.form.keywords.addPlaceholder')}
                            value={newKeyword}
                            onChange={(e) => setNewKeyword(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddKeyword();
                                }
                            }}
                            className={cn(
                                isMobile ? "h-8 text-sm" : "flex-1"
                            )}
                        />
                        <Button
                            type="button"
                            onClick={handleAddKeyword}
                            className={cn(
                                isMobile && "h-8 text-xs"
                            )}
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
                                        className={cn(
                                            "flex items-center gap-2 hover:bg-secondary/80",
                                            isMobile ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm"
                                        )}
                                    >
                                        {keyword}
                                        <button
                                            onClick={() => handleRemoveKeyword(keyword)}
                                            className="text-muted-foreground hover:text-foreground transition-colors"
                                            type="button"
                                            title={t('products.editor.form.keywords.removeTooltip')}
                                            aria-label={t('products.editor.form.keywords.removeTooltip')}
                                        >
                                            <X className={cn(isMobile ? "h-2.5 w-2.5" : "h-3 w-3")} />
                                        </button>
                                    </Badge>
                                ))}
                                {keywords.length === 0 && (
                                    <div className="w-full h-full flex items-center justify-center p-4">
                                        <p className={cn(
                                            "text-center text-muted-foreground",
                                            isMobile ? "text-xs" : "text-sm"
                                        )}>
                                            {t('products.editor.form.keywords.empty') || 'No keywords added yet. Add keywords or use the generate button.'}
                                        </p>
                                    </div>
                                )}
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
