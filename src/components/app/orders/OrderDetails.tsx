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
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface OrderDetailsProps {
    order: Order;
}

export function OrderDetails({ order }: OrderDetailsProps) {
    const totalAmount = order.FACTURES.reduce((sum, invoice) => sum + invoice.TOTAL, 0);
    const totalItems = order.ARTICLES.reduce((sum, article) => sum + article.CANT, 0);

    return (
        <div className="bg-muted/50 p-6 space-y-8">
            {/* Order Summary */}
            <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight">Order Details</h2>
                    <p className="text-sm text-muted-foreground">
                        {format(new Date(order.TRANSACTIONS[0]?.FECHA_APROBACION), 'PPP')}
                    </p>
                </div>
                <div className="flex gap-3">
                    <Badge variant="outline" className="px-3 py-1">
                        {totalItems} {totalItems === 1 ? 'item' : 'items'}
                    </Badge>
                    <Badge variant="secondary" className="px-3 py-1">
                        Total: ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </Badge>
                </div>
            </div>

            <Separator />

            {/* Billing & Shipping Section */}
            <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                    <h4 className="text-lg font-semibold mb-4">Billing Information</h4>
                    <div className="space-y-2 text-sm">
                        <p className="font-medium">{order.NOMBRE} {order.APELLIDOS}</p>
                        <p className="text-muted-foreground">{order.RNC_NAME}</p>
                        {order.RNC && <p className="text-muted-foreground">RNC: {order.RNC}</p>}
                        <p className="text-muted-foreground">{order.EMAIL}</p>
                        <p className="text-muted-foreground">{order.TELEFONO}</p>
                    </div>
                </Card>
                <Card className="p-6">
                    <h4 className="text-lg font-semibold mb-4">Shipping Information</h4>
                    <div className="space-y-2 text-sm">
                        <p className="font-medium">{order.DIRECCION}</p>
                        <p className="text-muted-foreground">{order.CIUDAD}</p>
                        {order.PAIS && <p className="text-muted-foreground">{order.PAIS}</p>}
                        {order.COMENTARIO && (
                            <div className="mt-4 p-3 bg-muted rounded-md">
                                <p className="text-muted-foreground italic">{order.COMENTARIO}</p>
                            </div>
                        )}
                    </div>
                </Card>
            </div>

            {/* Items */}
            <Card className="p-6">
                <h4 className="text-lg font-semibold mb-4">Items</h4>
                <div className="rounded-lg overflow-hidden border">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead>SKU</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Discount</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {order.ARTICLES.map((article) => (
                                <TableRow key={article.EAN} className="hover:bg-muted/50">
                                    <TableCell className="font-medium">{article.EAN}</TableCell>
                                    <TableCell>{article.DESCRIPCION}</TableCell>
                                    <TableCell>{article.CANT}</TableCell>
                                    <TableCell>${article.PRECIO.toLocaleString('en-US', { minimumFractionDigits: 2 })}</TableCell>
                                    <TableCell>
                                        {article.TOTAL_DISCOUNT > 0 ? (
                                            <span className="text-red-500">
                                                -${article.TOTAL_DISCOUNT.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                            </span>
                                        ) : (
                                            '-'
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                        ${article.TOTAL.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            {/* Invoices */}
            <Card className="p-6">
                <h4 className="text-lg font-semibold mb-4">Invoices</h4>
                <div className="rounded-lg overflow-hidden border">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead>Invoice #</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>NCF</TableHead>
                                <TableHead>ITBIS</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {order.FACTURES.map((invoice) => (
                                <TableRow key={invoice.FACTURAS} className="hover:bg-muted/50">
                                    <TableCell className="font-medium">{invoice.FACTURAS}</TableCell>
                                    <TableCell>{invoice.DEPTO}</TableCell>
                                    <TableCell>{invoice.NCF}</TableCell>
                                    <TableCell>${invoice.ITBIS.toLocaleString('en-US', { minimumFractionDigits: 2 })}</TableCell>
                                    <TableCell className="text-right font-medium">
                                        ${invoice.TOTAL.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            {/* Transactions */}
            <Card className="p-6">
                <h4 className="text-lg font-semibold mb-4">Transactions</h4>
                <div className="rounded-lg overflow-hidden border">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead>Card</TableHead>
                                <TableHead>Approval</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Time</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {order.TRANSACTIONS.map((transaction) => (
                                <TableRow key={transaction.APROBACION} className="hover:bg-muted/50">
                                    <TableCell className="font-medium">{transaction.TARJETA}</TableCell>
                                    <TableCell>{transaction.APROBACION}</TableCell>
                                    <TableCell>{format(new Date(transaction.FECHA_APROBACION), 'MMM d, yyyy')}</TableCell>
                                    <TableCell>{transaction.HORA_APROBACION}</TableCell>
                                    <TableCell className="text-right font-medium">
                                        ${transaction.TOTAL.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </div>
    );
} 