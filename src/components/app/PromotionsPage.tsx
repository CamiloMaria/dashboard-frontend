import { PromotionsTable } from "./promotions/PromotionsTable";
import { useTranslation } from "react-i18next";

export function PromotionsPage() {
    const { t } = useTranslation();

    return (
        <div className="container py-4 sm:py-6 space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                <h1 className="text-2xl sm:text-3xl font-bold">{t('promotions.title')}</h1>
            </div>
            <PromotionsTable />
        </div>
    );
} 