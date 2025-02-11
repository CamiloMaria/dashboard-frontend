import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Wand2, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ConfirmationDialog } from '@/components/app/ConfirmationDialog';

interface KeywordsTabProps {
    keywords: string[];
    title: string;
    category: string;
    onKeywordsChange: (keywords: string[]) => void;
}

// Mock API function - replace with actual API call later
const generateKeywords = async (title: string, category: string): Promise<string[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
        ...title.toLowerCase().split(' '),
        category.toLowerCase(),
        'product',
        'quality',
        'premium',
        'best-seller'
    ];
};

export function KeywordsTab({ keywords, title, category, onKeywordsChange }: KeywordsTabProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [showGenerateConfirm, setShowGenerateConfirm] = useState(false);
    const [newKeyword, setNewKeyword] = useState('');
    const { toast } = useToast();

    const handleGenerateClick = () => {
        setShowGenerateConfirm(true);
    };

    const handleGenerateConfirm = async () => {
        try {
            setIsGenerating(true);
            const generatedKeywords = await generateKeywords(title, category);
            // Merge existing and new keywords, remove duplicates
            const updatedKeywords = [...new Set([...keywords, ...generatedKeywords])];
            onKeywordsChange(updatedKeywords);
            toast({
                title: 'Keywords generated',
                description: 'New keywords have been generated and added successfully.',
            });
        } catch {
            toast({
                title: 'Error',
                description: 'Failed to generate keywords. Please try again.',
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
                            <CardTitle>Product Keywords</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Manage search keywords for this product
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
                            {isGenerating ? 'Generating...' : 'Generate Keywords'}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col space-y-3 min-h-0">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Add new keyword..."
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
                            Add
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
                title="Generate Keywords"
                description="This will generate new keywords based on the product title and category. The generated keywords will be merged with existing ones. Do you want to continue?"
                confirmText="Generate"
                isLoading={isGenerating}
                onConfirm={handleGenerateConfirm}
                onCancel={handleGenerateCancel}
            />
        </>
    );
}
