import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, Tags } from "lucide-react";

export function ExamplePage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Welcome to Plaza Lama Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                    This dashboard helps you manage your e-commerce operations efficiently.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            <CardTitle className="text-xl">Products</CardTitle>
                        </div>
                        <CardDescription>
                            Manage your product inventory
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-4 space-y-2">
                            <li>View and edit product details</li>
                            <li>Update stock levels</li>
                            <li>Manage product images</li>
                            <li>Set pricing and discounts</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="space-y-1">
                        <div className="flex items-center gap-2">
                            <ShoppingCart className="h-5 w-5" />
                            <CardTitle className="text-xl">Orders</CardTitle>
                        </div>
                        <CardDescription>
                            Track and manage customer orders
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-4 space-y-2">
                            <li>View order details</li>
                            <li>Process new orders</li>
                            <li>Track order status</li>
                            <li>Handle returns and refunds</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Tags className="h-5 w-5" />
                            <CardTitle className="text-xl">Promotions</CardTitle>
                        </div>
                        <CardDescription>
                            Create and manage promotions
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-4 space-y-2">
                            <li>Set up discount campaigns</li>
                            <li>Create promotional bundles</li>
                            <li>Schedule seasonal offers</li>
                            <li>Track promotion performance</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Need Help?</CardTitle>
                    <CardDescription>
                        If you need assistance or have questions about using the dashboard, here are some resources:
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold mb-2">Contact Support</h3>
                            <p className="text-muted-foreground">
                                Email: support@plazalama.com<br />
                                Phone: +1 (809) 123-4567<br />
                                Hours: Monday - Friday, 9:00 AM - 6:00 PM EST
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">Quick Tips</h3>
                            <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                                <li>Use the sidebar to navigate between different sections</li>
                                <li>Click on any item to view more details</li>
                                <li>Most tables can be sorted by clicking on column headers</li>
                                <li>Use the search bars to quickly find what you need</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 