import { Order } from '@/types/order';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
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
import {
    Package2,
    CreditCard,
    Truck,
    Receipt,
    Building2,
    Mail,
    Phone,
    MapPin,
    Globe,
    MessageSquare,
    Calendar,
    Clock,
    DollarSign,
    // Percent,
    ShoppingCart
} from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';

interface OrderDetailsProps {
    order: Order;
}

export function OrderDetails({ order }: OrderDetailsProps) {
    const { t } = useTranslation();
    const totalAmount = order.FACTURES.reduce((sum, invoice) => sum + invoice.TOTAL, 0);
    const totalItems = order.ARTICLES.reduce((sum, article) => sum + article.CANT, 0);

    // Media query hook for responsive design
    const isTablet = useMediaQuery("(min-width: 768px)");

    // Mobile card view for order items
    const MobileOrderItem = ({ article }: { article: Order['ARTICLES'][0] }) => (
        <div className="border rounded-lg p-4 mb-3">
            <div className="flex justify-between items-start mb-2">
                <div className="font-medium">{article.EAN}</div>
                <div className="flex items-center justify-end gap-1 font-medium">
                    <DollarSign className="w-4 h-4" />
                    {article.TOTAL.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
            </div>
            <div className="text-sm mb-3">{article.DESCRIPCION}</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                    <div className="text-muted-foreground">Quantity</div>
                    <div className="font-medium">{article.CANT}</div>
                </div>
                <div>
                    <div className="text-muted-foreground">Price</div>
                    <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        {article.PRECIO.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                </div>
                {article.TOTAL_DISCOUNT > 0 && (
                    <div className="col-span-2">
                        <div className="text-muted-foreground">Discount</div>
                        <div className="flex items-center gap-1 text-red-500">
                            {/* <Percent className="w-3 h-3" /> */}
                            -${article.TOTAL_DISCOUNT.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    // Mobile card view for invoices
    const MobileInvoiceItem = ({ invoice }: { invoice: Order['FACTURES'][0] }) => (
        <div className="border rounded-lg p-4 mb-3">
            <div className="flex justify-between items-start mb-2">
                <div className="font-medium">{invoice.FACTURAS}</div>
                <div className="flex items-center justify-end gap-1 font-medium">
                    <DollarSign className="w-4 h-4" />
                    {invoice.TOTAL.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                    <div className="text-muted-foreground">Department</div>
                    <div>{invoice.DEPTO}</div>
                </div>
                <div>
                    <div className="text-muted-foreground">NCF</div>
                    <div>{invoice.NCF}</div>
                </div>
                <div className="col-span-2">
                    <div className="text-muted-foreground">ITBIS</div>
                    <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        {invoice.ITBIS.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                </div>
            </div>
        </div>
    );

    // Mobile card view for transactions
    const MobileTransactionItem = ({ transaction }: { transaction: Order['TRANSACTIONS'][0] }) => (
        <div className="border rounded-lg p-4 mb-3">
            <div className="flex justify-between items-start mb-2">
                <div className="font-medium">{transaction.TARJETA}</div>
                <div className="flex items-center justify-end gap-1 font-medium">
                    <DollarSign className="w-4 h-4" />
                    {transaction.TOTAL.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                    <div className="text-muted-foreground">Approval</div>
                    <div>{transaction.APROBACION}</div>
                </div>
                <div>
                    <div className="text-muted-foreground">Date</div>
                    <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(transaction.FECHA_APROBACION), 'MMM d, yyyy')}
                    </div>
                </div>
                <div className="col-span-2">
                    <div className="text-muted-foreground">Time</div>
                    <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {transaction.HORA_APROBACION}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto p-3 sm:p-6 rounded-xl shadow-sm space-y-6 sm:space-y-8">
            {/* Order Summary */}
            <div className="relative">
                <div className="flex flex-wrap gap-3 sm:gap-4 items-center justify-between">
                    <div className="space-y-1 sm:space-y-2">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
                            {t('orders.details.title')}
                        </h2>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <p className="text-xs sm:text-sm">
                                {format(new Date(order.TRANSACTIONS[0]?.FECHA_APROBACION), 'PPP')}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                        <Badge variant="outline" className="px-2 sm:px-4 py-1 sm:py-2 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                            <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
                            {totalItems} {totalItems === 1 ? 'item' : 'items'}
                        </Badge>
                        <Badge variant="secondary" className="px-2 sm:px-4 py-1 sm:py-2 flex items-center gap-1 sm:gap-2 bg-green-100 text-green-800 text-xs sm:text-sm">
                            <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
                            ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </Badge>
                    </div>
                </div>
                <Separator className="my-4 sm:my-6" />
            </div>

            {/* Billing & Shipping Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <Card className="p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                        <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                        <h4 className="text-base sm:text-lg font-semibold">{t('orders.details.billingInformation')}</h4>
                    </div>
                    <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                        <div className="flex items-center gap-2">
                            <Building2 className="w-3 h-3 sm:w-4 sm:h-4" />
                            <p className="font-medium">{order.NOMBRE} {order.APELLIDOS}</p>
                        </div>
                        <p className="pl-5 sm:pl-6">{order.RNC_NAME}</p>
                        {order.RNC && <p className="pl-5 sm:pl-6">RNC: {order.RNC}</p>}
                        <div className="flex items-center gap-2">
                            <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                            <p className="break-all">{order.EMAIL}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                            <p>{order.TELEFONO}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                        <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                        <h4 className="text-base sm:text-lg font-semibold">{t('orders.details.shippingInformation')}</h4>
                    </div>
                    <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                        <div className="flex items-start gap-2">
                            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5" />
                            <p className="font-medium">{order.DIRECCION}</p>
                        </div>
                        <div className="flex items-center gap-2 pl-5 sm:pl-6">
                            <Building2 className="w-3 h-3 sm:w-4 sm:h-4" />
                            <p>{order.CIUDAD}</p>
                        </div>
                        {order.PAIS && (
                            <div className="flex items-center gap-2 pl-5 sm:pl-6">
                                <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
                                <p>{order.PAIS}</p>
                            </div>
                        )}
                        {order.COMENTARIO && (
                            <div className="mt-3 sm:mt-4 p-3 sm:p-4 rounded-lg border">
                                <div className="flex items-start gap-2">
                                    <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5" />
                                    <p className="italic text-xs sm:text-sm">{order.COMENTARIO}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>
            </div>

            {/* Items */}
            <Card className="p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center gap-2 mb-4 sm:mb-6">
                    <Package2 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                    <h4 className="text-base sm:text-lg font-semibold">{t('orders.details.items')}</h4>
                </div>

                {/* Mobile view for items */}
                {!isTablet && (
                    <div className="space-y-2">
                        {order.ARTICLES.map((article) => (
                            <MobileOrderItem key={article.EAN} article={article} />
                        ))}
                    </div>
                )}

                {/* Desktop view for items */}
                {isTablet && (
                    <div className="rounded-lg overflow-hidden border">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="font-semibold">{t('orders.details.columns.sku')}</TableHead>
                                        <TableHead className="font-semibold">{t('orders.details.columns.description')}</TableHead>
                                        <TableHead className="font-semibold">{t('orders.details.columns.quantity')}</TableHead>
                                        <TableHead className="font-semibold">{t('orders.details.columns.price')}</TableHead>
                                        <TableHead className="font-semibold">{t('orders.details.columns.discount')}</TableHead>
                                        <TableHead className="text-right font-semibold">{t('orders.details.columns.total')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {order.ARTICLES.map((article) => (
                                        <TableRow key={article.EAN} className="transition-colors">
                                            <TableCell className="font-medium">{article.EAN}</TableCell>
                                            <TableCell>{article.DESCRIPCION}</TableCell>
                                            <TableCell className="font-medium">{article.CANT}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <DollarSign className="w-4 h-4" />
                                                    {article.PRECIO.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {article.TOTAL_DISCOUNT > 0 ? (
                                                    <div className="flex items-center gap-1 text-red-500">
                                                        {/* <Percent className="w-4 h-4" /> */}
                                                        -${article.TOTAL_DISCOUNT.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                    </div>
                                                ) : (
                                                    '-'
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right font-medium">
                                                <div className="flex items-center justify-end gap-1">
                                                    <DollarSign className="w-4 h-4" />
                                                    {article.TOTAL.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                )}
            </Card>

            {/* Invoices */}
            <Card className="p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center gap-2 mb-4 sm:mb-6">
                    <Receipt className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                    <h4 className="text-base sm:text-lg font-semibold">{t('orders.details.invoices')}</h4>
                </div>

                {/* Mobile view for invoices */}
                {!isTablet && (
                    <div className="space-y-2">
                        {order.FACTURES.map((invoice) => (
                            <MobileInvoiceItem key={invoice.FACTURAS} invoice={invoice} />
                        ))}
                    </div>
                )}

                {/* Desktop view for invoices */}
                {isTablet && (
                    <div className="rounded-lg overflow-hidden border">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="font-semibold">{t('orders.details.columns.invoiceNumber')}</TableHead>
                                        <TableHead className="font-semibold">{t('orders.details.columns.department')}</TableHead>
                                        <TableHead className="font-semibold">{t('orders.details.columns.ncf')}</TableHead>
                                        <TableHead className="font-semibold">{t('orders.details.columns.itbis')}</TableHead>
                                        <TableHead className="text-right font-semibold">{t('orders.details.columns.total')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {order.FACTURES.map((invoice) => (
                                        <TableRow key={invoice.FACTURAS} className="transition-colors">
                                            <TableCell className="font-medium">{invoice.FACTURAS}</TableCell>
                                            <TableCell>{invoice.DEPTO}</TableCell>
                                            <TableCell>{invoice.NCF}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <DollarSign className="w-4 h-4" />
                                                    {invoice.ITBIS.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right font-medium">
                                                <div className="flex items-center justify-end gap-1">
                                                    <DollarSign className="w-4 h-4" />
                                                    {invoice.TOTAL.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                )}
            </Card>

            {/* Transactions */}
            <Card className="p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center gap-2 mb-4 sm:mb-6">
                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                    <h4 className="text-base sm:text-lg font-semibold">{t('orders.details.transactions')}</h4>
                </div>

                {/* Mobile view for transactions */}
                {!isTablet && (
                    <div className="space-y-2">
                        {order.TRANSACTIONS.map((transaction) => (
                            <MobileTransactionItem key={transaction.APROBACION} transaction={transaction} />
                        ))}
                    </div>
                )}

                {/* Desktop view for transactions */}
                {isTablet && (
                    <div className="rounded-lg overflow-hidden border">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="font-semibold">{t('orders.details.columns.card')}</TableHead>
                                        <TableHead className="font-semibold">{t('orders.details.columns.approval')}</TableHead>
                                        <TableHead className="font-semibold">{t('orders.details.columns.date')}</TableHead>
                                        <TableHead className="font-semibold">{t('orders.details.columns.time')}</TableHead>
                                        <TableHead className="text-right font-semibold">{t('orders.details.columns.amount')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {order.TRANSACTIONS.map((transaction) => (
                                        <TableRow key={transaction.APROBACION} className="transition-colors">
                                            <TableCell className="font-medium">{transaction.TARJETA}</TableCell>
                                            <TableCell>{transaction.APROBACION}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {format(new Date(transaction.FECHA_APROBACION), 'MMM d, yyyy')}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {transaction.HORA_APROBACION}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right font-medium">
                                                <div className="flex items-center justify-end gap-1">
                                                    <DollarSign className="w-4 h-4" />
                                                    {transaction.TOTAL.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}