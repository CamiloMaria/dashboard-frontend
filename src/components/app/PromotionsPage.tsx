import { PromotionsTable } from "./promotions/PromotionsTable";

export function PromotionsPage() {
    return (
        <div className="container py-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Promotions</h1>
            </div>
            <PromotionsTable />
        </div>
    );
} 