import { format } from "date-fns";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Log } from "@/types/auth";
import { AlertCircle, CheckCircle2, Clock, FileEdit, Info, User2, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LogDetailsModal } from "./LogDetailsModal";
import { useTranslation } from "react-i18next";

interface LogsTableProps {
    logs: Log[];
}

const getLogTypeConfig = (type: string, t: (key: string) => string) => {
    const configs = {
        create: {
            icon: CheckCircle2,
            className: "text-green-500 bg-green-50 border-green-100",
            label: t("logs.types.create"),
        },
        update: {
            icon: FileEdit,
            className: "text-blue-500 bg-blue-50 border-blue-100",
            label: t("logs.types.update"),
        },
        delete: {
            icon: AlertCircle,
            className: "text-red-500 bg-red-50 border-red-100",
            label: t("logs.types.delete"),
        },
        info: {
            icon: Info,
            className: "text-gray-500 bg-gray-50 border-gray-100",
            label: t("logs.types.info"),
        },
    };

    return configs[type.toLowerCase() as keyof typeof configs] || configs.info;
};

export function LogsTable({ logs }: LogsTableProps) {
    const { t } = useTranslation();
    const [selectedLog, setSelectedLog] = useState<Log | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleViewDetails = (log: Log) => {
        setSelectedLog(log);
        setIsModalOpen(true);
    };

    return (
        <>
            <div className="rounded-lg border bg-card overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[100px]">{t("logs.columns.id")}</TableHead>
                            <TableHead className="w-[180px]">{t("logs.columns.user")}</TableHead>
                            <TableHead className="w-[120px]">{t("logs.columns.type")}</TableHead>
                            <TableHead className="w-[150px]">{t("logs.columns.field")}</TableHead>
                            <TableHead>{t("logs.columns.log")}</TableHead>
                            <TableHead className="w-[180px] text-right">{t("logs.columns.date")}</TableHead>
                            <TableHead className="w-[100px] text-right">{t("logs.columns.actions")}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logs.map((log) => {
                            const typeConfig = getLogTypeConfig(log.type_log, t);
                            const LogIcon = typeConfig.icon;
                            const hasDetails = !!log.details;

                            return (
                                <TableRow
                                    key={log.id}
                                    className="group"
                                >
                                    <TableCell className="font-mono text-xs text-muted-foreground">
                                        {log.id}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center">
                                                <User2 className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">{log.user}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className={cn(
                                            "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border",
                                            typeConfig.className
                                        )}>
                                            <LogIcon className="h-3.5 w-3.5" />
                                            {typeConfig.label}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-100">
                                            {log.field}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="max-w-[400px] truncate group-hover:whitespace-normal">
                                            {log.log}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1.5 text-muted-foreground">
                                            <Clock className="h-3.5 w-3.5" />
                                            <time dateTime={log.date_timer} className="tabular-nums">
                                                {format(new Date(log.date_timer), "MMM d, yyyy HH:mm:ss")}
                                            </time>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {hasDetails ? (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleViewDetails(log)}
                                                className="opacity-70 hover:opacity-100 transition-opacity"
                                            >
                                                <Eye className="h-4 w-4 mr-1" />
                                                {t("logs.viewDetails")}
                                            </Button>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">{t("logs.noDetails")}</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            <LogDetailsModal
                log={selectedLog}
                isOpen={isModalOpen}
                onClose={setIsModalOpen}
            />
        </>
    );
}