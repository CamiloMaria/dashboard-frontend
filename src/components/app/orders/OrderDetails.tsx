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
    ShoppingCart,
    Printer,
    Loader2,
    AlertCircle
} from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ordersApi } from '@/api/orders';
import { toast } from '@/hooks/use-toast';
import { PrintOrderBody, spooler } from '@/types/order';

interface OrderDetailsProps {
    order: Order;
}

interface ApiError extends Error {
    response?: {
        status: number;
        data?: {
            error: string;
            message: string;
        }
    }
}

export function OrderDetails({ order }: OrderDetailsProps) {
    const { t } = useTranslation();
    const totalAmount = order.FACTURAS.reduce((sum, invoice) => sum + invoice.TOTAL, 0);
    const totalItems = order.ARTICULOS.reduce((sum, article) => sum + article.CANT, 0);

    // State for print dialog
    const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
    const [selectedPrinter, setSelectedPrinter] = useState<string | null>(null);
    const [forcePrint, setForcePrint] = useState(false);

    // Media query hook for responsive design
    const isTablet = useMediaQuery("(min-width: 768px)");

    // Fetch printers using React Query
    const spoolerQuery = useQuery({
        queryKey: ['spooler'],
        queryFn: () => ordersApi.getSpooler(),
        enabled: isPrintDialogOpen, // Only fetch when dialog is open
        retry(failureCount, error: ApiError) {
            if (error?.response?.status === 403 || error?.response?.status === 404) {
                return false;
            }
            // Default retry logic for other errors
            return failureCount < 3;
        }
    });

    // Mutation for printing order
    const printMutation = useMutation({
        mutationFn: (data: PrintOrderBody) => ordersApi.printOrder(data),
        onSuccess: () => {
            toast({
                title: t('orders.print.success'),
                description: t('orders.print.successDescription'),
                variant: 'default',
            });
            setIsPrintDialogOpen(false);
            setSelectedPrinter(null);
            setForcePrint(false);
        },
        onError: () => {
            toast({
                title: t('orders.print.error'),
                description: t('orders.print.errorDescription'),
                variant: 'destructive',
            });
        },
    });

    // Handle print button click
    const handlePrintClick = () => {
        setIsPrintDialogOpen(true);
    };

    // Handle printer selection
    const handlePrinterSelect = (value: string) => {
        setSelectedPrinter(value);
    };

    // Handle dialog open change
    const handleDialogOpenChange = (open: boolean) => {
        setIsPrintDialogOpen(open);
        if (!open) {
            setSelectedPrinter(null);
            setForcePrint(false);
        }
    };

    // Handle print confirmation
    const handlePrintConfirm = () => {
        if (selectedPrinter) {
            printMutation.mutate({
                orderNumber: order.ORDEN,
                spooler: selectedPrinter,
                forcePrint: forcePrint
            });
        }
    };

    // Mobile card view for order items
    const MobileOrderItem = ({ article }: { article: Order['ARTICULOS'][0] }) => (
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
    const MobileInvoiceItem = ({ invoice }: { invoice: Order['FACTURAS'][0] }) => (
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
    const MobileTransactionItem = ({ transaction }: { transaction: Order['TRANSACCIONES'][0] }) => (
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
                                {format(new Date(order.TRANSACCIONES[0]?.FECHA_APROBACION), 'PPP')}
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
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1 sm:gap-2"
                            onClick={handlePrintClick}
                            disabled={printMutation.isPending}
                        >
                            <Printer className="w-3 h-3 sm:w-4 sm:h-4" />
                            {printMutation.isPending ? t('orders.print.printing') : t('orders.print.printOrder')}
                            {printMutation.isPending && <Loader2 className="ml-1 h-3 w-3 animate-spin" />}
                        </Button>
                    </div>
                </div>
                <Separator className="my-4 sm:my-6" />
            </div>

            {/* Print Dialog */}
            <Dialog open={isPrintDialogOpen} onOpenChange={handleDialogOpenChange}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{t('orders.print.selectPrinter')}</DialogTitle>
                        <DialogDescription>
                            {t('orders.print.selectPrinterDescription')}
                        </DialogDescription>
                    </DialogHeader>

                    {/* Dialog Content */}
                    <div className="py-4">
                        {spoolerQuery.isLoading && (
                            <div className="flex flex-col items-center justify-center py-8">
                                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                <p className="mt-2 text-sm text-muted-foreground">{t('orders.print.loadingPrinters')}</p>
                            </div>
                        )}

                        {spoolerQuery.isError && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertDescription>
                                    {t('orders.print.errorLoadingPrinters')}
                                </AlertDescription>
                            </Alert>
                        )}

                        {spoolerQuery.isSuccess && spoolerQuery.data.data.length === 0 && (
                            <Alert className="mb-4">
                                <AlertDescription>
                                    {t('orders.print.noPrintersFound')}
                                </AlertDescription>
                            </Alert>
                        )}

                        {spoolerQuery.isSuccess && spoolerQuery.data.data.length > 0 && (
                            <RadioGroup
                                value={selectedPrinter || ""}
                                onValueChange={handlePrinterSelect}
                                className="gap-3"
                            >
                                {spoolerQuery.data.data.map((printer: spooler) => (
                                    <div key={printer.spooler} className="flex items-center space-x-2 border p-3 rounded-md">
                                        <RadioGroupItem value={printer.spooler} id={printer.spooler} />
                                        <Label htmlFor={printer.spooler} className="flex flex-col">
                                            <span className="font-medium">{printer.spooler}</span>
                                            <span className="text-xs text-muted-foreground">{printer.model}</span>
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        )}

                        {/* Force Print Checkbox */}
                        {spoolerQuery.isSuccess && spoolerQuery.data.data.length > 0 && (
                            <div className="mt-4 space-y-2">
                                <div className="flex items-start space-x-2">
                                    <Checkbox
                                        id="force-print"
                                        checked={forcePrint}
                                        onCheckedChange={(checked) => setForcePrint(checked === true)}
                                    />
                                    <div className="grid gap-1.5 leading-none">
                                        <Label
                                            htmlFor="force-print"
                                            className="font-medium text-sm"
                                        >
                                            {t('orders.print.forcePrint')}
                                        </Label>
                                    </div>
                                </div>

                                {forcePrint && (
                                    <Alert variant="destructive" className="mt-2">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle>{t('orders.print.warningTitle')}</AlertTitle>
                                        <AlertDescription>
                                            {t('orders.print.forcePrintWarning')}
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>
                        )}
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => setIsPrintDialogOpen(false)}
                            disabled={printMutation.isPending}
                        >
                            {t('common.cancel')}
                        </Button>
                        <Button
                            onClick={handlePrintConfirm}
                            disabled={!selectedPrinter || printMutation.isPending || spoolerQuery.isLoading}
                        >
                            {printMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {t('orders.print.printing')}
                                </>
                            ) : (
                                <>
                                    <Printer className="mr-2 h-4 w-4" />
                                    {t('orders.print.print')}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

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
                        {order.ARTICULOS.map((article) => (
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
                                    {order.ARTICULOS.map((article) => (
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
                        {order.FACTURAS.map((invoice) => (
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
                                    {order.FACTURAS.map((invoice) => (
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
                        {order.TRANSACCIONES.map((transaction) => (
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
                                    {order.TRANSACCIONES.map((transaction) => (
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