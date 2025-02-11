import { OrdersTable } from './OrdersTable';

export function OrdersPage() {
    return (
        <div className="container py-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Orders</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        View and manage customer orders
                    </p>
                </div>
            </div>
            <OrdersTable />
        </div>
    );
} 