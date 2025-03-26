import { Boxes, FileText, Tags } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type Product, type Specification } from '@/types/product';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SpecificationsTab } from './SpecificationsTab';
import { InventoryTab } from './InventoryTab';
import { DescriptionTab } from './DescriptionTab';
import { KeywordsTab } from './KeywordsTab';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export interface ProductTabsProps {
    product: Product | undefined;
    specifications: Specification[];
    onSpecificationsChange: (specifications: Specification[]) => void;
    description: string;
    onDescriptionChange: (description: string) => void;
    title: string;
    sku: string;
    keywords: string[];
    onKeywordsChange: (keywords: string[]) => void;
    isMobile?: boolean;
    isTablet?: boolean;
}

export function ProductTabs({
    product,
    specifications,
    onSpecificationsChange,
    description,
    onDescriptionChange,
    title,
    sku,
    keywords,
    onKeywordsChange,
    isMobile,
    isTablet
}: ProductTabsProps) {
    const { t } = useTranslation();
    const isSmallScreen = isMobile || isTablet;

    return (
        <TooltipProvider>
            <Tabs defaultValue="catalog" className="w-full">
                <TabsList className={cn(
                    "w-full justify-start border-b rounded-none p-0 bg-transparent",
                    isSmallScreen ? "flex-wrap gap-1 h-auto" : "h-auto"
                )}>
                    <TabsTrigger
                        value="catalog"
                        className={cn(
                            "rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent",
                            isMobile && "text-xs py-1.5 px-2",
                            isTablet && !isMobile && "text-sm py-2 px-3"
                        )}
                    >
                        <Boxes className={cn("mr-2", isMobile ? "h-3 w-3" : "h-4 w-4")} />
                        {t('products.editor.form.tabs.catalog')}
                    </TabsTrigger>
                    <TabsTrigger
                        value="specifications"
                        className={cn(
                            "rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent",
                            isMobile && "text-xs py-1.5 px-2",
                            isTablet && !isMobile && "text-sm py-2 px-3"
                        )}
                    >
                        <Boxes className={cn("mr-2", isMobile ? "h-3 w-3" : "h-4 w-4")} />
                        {t('products.editor.form.tabs.specifications')}
                    </TabsTrigger>
                    <TabsTrigger
                        value="description"
                        className={cn(
                            "rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent",
                            isMobile && "text-xs py-1.5 px-2",
                            isTablet && !isMobile && "text-sm py-2 px-3"
                        )}
                    >
                        <FileText className={cn("mr-2", isMobile ? "h-3 w-3" : "h-4 w-4")} />
                        {t('products.editor.form.tabs.description')}
                    </TabsTrigger>
                    <TabsTrigger
                        value="keywords"
                        className={cn(
                            "rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent",
                            isMobile && "text-xs py-1.5 px-2",
                            isTablet && !isMobile && "text-sm py-2 px-3"
                        )}
                    >
                        <Tags className={cn("mr-2", isMobile ? "h-3 w-3" : "h-4 w-4")} />
                        {t('products.editor.form.tabs.keywords')}
                    </TabsTrigger>
                </TabsList>
                <div className="mt-4 sm:mt-6">
                    <TabsContent value="specifications" className="m-0">
                        <SpecificationsTab
                            specifications={specifications}
                            onSpecificationsChange={onSpecificationsChange}
                        />
                    </TabsContent>
                    <TabsContent value="catalog" className="m-0">
                        <InventoryTab
                            product={product}
                        />
                    </TabsContent>
                    <TabsContent value="description" className="m-0">
                        <DescriptionTab
                            description={description}
                            title={title}
                            onDescriptionChange={onDescriptionChange}
                        />
                    </TabsContent>
                    <TabsContent value="keywords" className="m-0">
                        <KeywordsTab
                            keywords={keywords}
                            sku={sku}
                            onKeywordsChange={onKeywordsChange}
                        />
                    </TabsContent>
                </div>
            </Tabs>
        </TooltipProvider>
    );
} 