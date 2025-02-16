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
    Percent,
    ShoppingCart
} from 'lucide-react';

interface OrderDetailsProps {
    order: Order;
}

export function OrderDetails({ order }: OrderDetailsProps) {
    const { t } = useTranslation();
    const totalAmount = order.FACTURES.reduce((sum, invoice) => sum + invoice.TOTAL, 0);
    const totalItems = order.ARTICLES.reduce((sum, article) => sum + article.CANT, 0);

    return (
        <div className="max-w-7xl mx-auto p-6 rounded-xl shadow-sm space-y-8">
            {/* Order Summary */}
            <div className="relative">
                <div className="flex flex-wrap gap-4 items-center justify-between">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight">
                            {t('orders.details.title')}
                        </h2>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <p className="text-sm">
                                {format(new Date(order.TRANSACTIONS[0]?.FECHA_APROBACION), 'PPP')}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Badge variant="outline" className="px-4 py-2 flex items-center gap-2">
                            <ShoppingCart className="w-4 h-4" />
                            {totalItems} {totalItems === 1 ? 'item' : 'items'}
                        </Badge>
                        <Badge variant="secondary" className="px-4 py-2 flex items-center gap-2 bg-green-100 text-green-800">
                            <DollarSign className="w-4 h-4" />
                            ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </Badge>
                    </div>
                </div>
                <Separator className="my-6" />
            </div>

            {/* Billing & Shipping Section */}
            <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center gap-2 mb-4">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                        <h4 className="text-lg font-semibold">{t('orders.details.billingInformation')}</h4>
                    </div>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            <p className="font-medium">{order.NOMBRE} {order.APELLIDOS}</p>
                        </div>
                        <p className="pl-6">{order.RNC_NAME}</p>
                        {order.RNC && <p className="pl-6">RNC: {order.RNC}</p>}
                        <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <p>{order.EMAIL}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <p>{order.TELEFONO}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center gap-2 mb-4">
                        <Truck className="w-5 h-5 text-green-600" />
                        <h4 className="text-lg font-semibold">{t('orders.details.shippingInformation')}</h4>
                    </div>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <p className="font-medium">{order.DIRECCION}</p>
                        </div>
                        <div className="flex items-center gap-2 pl-6">
                            <Building2 className="w-4 h-4" />
                            <p>{order.CIUDAD}</p>
                        </div>
                        {order.PAIS && (
                            <div className="flex items-center gap-2 pl-6">
                                <Globe className="w-4 h-4" />
                                <p>{order.PAIS}</p>
                            </div>
                        )}
                        {order.COMENTARIO && (
                            <div className="mt-4 p-4 rounded-lg border">
                                <div className="flex items-start gap-2">
                                    <MessageSquare className="w-4 h-4 mt-1" />
                                    <p className="italic">{order.COMENTARIO}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>
            </div>

            {/* Items */}
            <Card className="p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center gap-2 mb-6">
                    <Package2 className="w-5 h-5 text-purple-600" />
                    <h4 className="text-lg font-semibold">{t('orders.details.items')}</h4>
                </div>
                <div className="rounded-lg overflow-hidden border">
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
                                                <Percent className="w-4 h-4" />
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
            </Card>

            {/* Invoices */}
            <Card className="p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center gap-2 mb-6">
                    <Receipt className="w-5 h-5 text-orange-600" />
                    <h4 className="text-lg font-semibold">{t('orders.details.invoices')}</h4>
                </div>
                <div className="rounded-lg overflow-hidden border">
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
            </Card>

            {/* Transactions */}
            <Card className="p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center gap-2 mb-6">
                    <CreditCard className="w-5 h-5 text-indigo-600" />
                    <h4 className="text-lg font-semibold">{t('orders.details.transactions')}</h4>
                </div>
                <div className="rounded-lg overflow-hidden border">
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
            </Card>
        </div>
    );
}