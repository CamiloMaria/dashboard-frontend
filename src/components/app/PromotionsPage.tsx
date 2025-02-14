import { PromotionsTable } from "./promotions/PromotionsTable";
import { useTranslation } from "react-i18next";

export function PromotionsPage() {
    const { t } = useTranslation();

    return (
        <div className="container py-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">{t('promotions.title')}</h1>
            </div>
            <PromotionsTable />
        </div>
    );
} 