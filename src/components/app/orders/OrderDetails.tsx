import { Order } from '@/types/order';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface OrderDetailsProps {
    order: Order;
}

export function OrderDetails({ order }: OrderDetailsProps) {
    return (
        <div className="bg-muted/50 p-6 space-y-6">
            {/* Billing & Shipping Section */}
            <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-4 space-y-3">
                    <h4 className="font-medium">Billing Information</h4>
                    <div className="space-y-1 text-sm">
                        <p>{order.NOMBRE} {order.APELLIDOS}</p>
                        <p>{order.RNC_NAME}</p>
                        {order.RNC && <p>RNC: {order.RNC}</p>}
                        <p>{order.EMAIL}</p>
                        <p>{order.TELEFONO}</p>
                    </div>
                </Card>
                <Card className="p-4 space-y-3">
                    <h4 className="font-medium">Shipping Information</h4>
                    <div className="space-y-1 text-sm">
                        <p>{order.DIRECCION}</p>
                        <p>{order.CIUDAD}</p>
                        {order.PAIS && <p>{order.PAIS}</p>}
                        {order.COMENTARIO && (
                            <p className="mt-2 text-muted-foreground">{order.COMENTARIO}</p>
                        )}
                    </div>
                </Card>
            </div>

            {/* Order Items */}
            <Card className="p-4 space-y-3">
                <h4 className="font-medium">Order Items</h4>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>SKU</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Discount</TableHead>
                            <TableHead>Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {order.ARTICLES.map((article) => (
                            <TableRow key={article.EAN}>
                                <TableCell className="font-medium">{article.EAN}</TableCell>
                                <TableCell>{article.DESCRIPCION}</TableCell>
                                <TableCell>{article.CANT}</TableCell>
                                <TableCell>${article.PRECIO.toLocaleString('en-US', { minimumFractionDigits: 2 })}</TableCell>
                                <TableCell>${article.TOTAL_DISCOUNT.toLocaleString('en-US', { minimumFractionDigits: 2 })}</TableCell>
                                <TableCell>${article.TOTAL.toLocaleString('en-US', { minimumFractionDigits: 2 })}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>

            {/* Invoices */}
            <Card className="p-4 space-y-3">
                <h4 className="font-medium">Invoices</h4>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Invoice #</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead>NCF</TableHead>
                            <TableHead>ITBIS</TableHead>
                            <TableHead>Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {order.FACTURES.map((invoice) => (
                            <TableRow key={invoice.FACTURAS}>
                                <TableCell className="font-medium">{invoice.FACTURAS}</TableCell>
                                <TableCell>{invoice.DEPTO}</TableCell>
                                <TableCell>{invoice.NCF}</TableCell>
                                <TableCell>${invoice.ITBIS.toLocaleString('en-US', { minimumFractionDigits: 2 })}</TableCell>
                                <TableCell>${invoice.TOTAL.toLocaleString('en-US', { minimumFractionDigits: 2 })}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>

            {/* Transactions */}
            <Card className="p-4 space-y-3">
                <h4 className="font-medium">Transactions</h4>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Card</TableHead>
                            <TableHead>Approval</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {order.TRANSACTIONS.map((transaction) => (
                            <TableRow key={transaction.APROBACION}>
                                <TableCell className="font-medium">{transaction.TARJETA}</TableCell>
                                <TableCell>{transaction.APROBACION}</TableCell>
                                <TableCell>{format(new Date(transaction.FECHA_APROBACION), 'MMM d, yyyy')}</TableCell>
                                <TableCell>{transaction.HORA_APROBACION}</TableCell>
                                <TableCell>${transaction.TOTAL.toLocaleString('en-US', { minimumFractionDigits: 2 })}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
} 