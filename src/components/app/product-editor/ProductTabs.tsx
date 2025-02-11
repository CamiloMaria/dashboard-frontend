import { Boxes, FileText, Tags } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type Product, type Specification } from '@/types/product';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SpecificationsTab } from './SpecificationsTab';
import { InventoryTab } from './InventoryTab';
import { DescriptionTab } from './DescriptionTab';
import { KeywordsTab } from './KeywordsTab';

export interface ProductTabsProps {
    product: Product | undefined;
    specifications: Specification[];
    onSpecificationsChange: (specifications: Specification[]) => void;
    description: string;
    onDescriptionChange: (description: string) => void;
    title: string;
    category: string;
    keywords: string[];
    onKeywordsChange: (keywords: string[]) => void;
}

export function ProductTabs({
    product,
    specifications,
    onSpecificationsChange,
    description,
    onDescriptionChange,
    title,
    category,
    keywords,
    onKeywordsChange
}: ProductTabsProps) {
    return (
        <TooltipProvider>
            <Tabs defaultValue="catalog" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                    <TabsTrigger value="catalog" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                        <Boxes className="h-4 w-4 mr-2" />
                        Catalog
                    </TabsTrigger>
                    <TabsTrigger value="specifications" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                        <Boxes className="h-4 w-4 mr-2" />
                        Specifications
                    </TabsTrigger>
                    <TabsTrigger value="description" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                        <FileText className="h-4 w-4 mr-2" />
                        Description
                    </TabsTrigger>
                    <TabsTrigger value="keywords" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                        <Tags className="h-4 w-4 mr-2" />
                        Keywords
                    </TabsTrigger>
                </TabsList>
                <div className="mt-6">
                    <TabsContent value="specifications" className="m-0">
                        <SpecificationsTab
                            specifications={specifications}
                            onSpecificationsChange={onSpecificationsChange}
                        />
                    </TabsContent>
                    <TabsContent value="catalog" className="m-0">
                        <InventoryTab product={product} />
                    </TabsContent>
                    <TabsContent value="description" className="m-0">
                        <DescriptionTab
                            description={description}
                            onDescriptionChange={onDescriptionChange}
                        />
                    </TabsContent>
                    <TabsContent value="keywords" className="m-0">
                        <KeywordsTab
                            keywords={keywords}
                            title={title}
                            category={category}
                            onKeywordsChange={onKeywordsChange}
                        />
                    </TabsContent>
                </div>
            </Tabs>
        </TooltipProvider>
    );
} 