import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Log } from "@/types/auth";

interface LogDetailsModalProps {
    log: Log | null;
    isOpen: boolean;
    onClose: (open: boolean) => void;
}

// Safely parse JSON string
function safeJsonParse(jsonString: string) {
    try {
        return JSON.parse(jsonString);
    } catch {
        return null;
    }
}

// Component to recursively render JSON with proper formatting
const JsonView = ({ data, level = 0 }: { data: unknown; level?: number }) => {
    const [expanded, setExpanded] = useState(true);

    if (data === null || data === undefined) {
        return <span className="text-gray-500">null</span>;
    }

    if (typeof data === "string") {
        return <span className="text-green-600">"{data}"</span>;
    }

    if (typeof data === "number") {
        return <span className="text-blue-600">{String(data)}</span>;
    }

    if (typeof data === "boolean") {
        return <span className="text-amber-600">{String(data)}</span>;
    }

    if (Array.isArray(data)) {
        if (data.length === 0) {
            return <span className="text-gray-500">[]</span>;
        }

        return (
            <div style={{ paddingLeft: level > 0 ? 20 : 0 }}>
                <span
                    className="text-gray-700 cursor-pointer inline-flex items-center"
                    onClick={() => setExpanded(!expanded)}
                >
                    <span className={`inline-flex justify-center items-center w-4 h-4 mr-1 text-xs font-bold ${expanded ? 'text-blue-500' : 'text-gray-500'}`}>
                        {expanded ? '▼' : '►'}
                    </span>
                    <span className="text-gray-600">[</span>
                    {!expanded && <span className="text-gray-500">...</span>}
                </span>
                {expanded && (
                    <div className="pl-6 border-l border-gray-200 ml-1">
                        {data.map((item, index) => (
                            <div key={index} className="py-0.5">
                                <JsonView data={item} level={level + 1} />
                                {index < data.length - 1 && <span className="text-gray-500">,</span>}
                            </div>
                        ))}
                        <div>{"]"}</div>
                    </div>
                )}
                {!expanded && <span className="text-gray-600">]</span>}
            </div>
        );
    }

    // Handle objects
    if (typeof data === "object") {
        const keys = Object.keys(data as Record<string, unknown>);

        if (keys.length === 0) {
            return <span className="text-gray-500">{"{}"}</span>;
        }

        return (
            <div style={{ paddingLeft: level > 0 ? 20 : 0 }}>
                <span
                    className="text-gray-700 cursor-pointer inline-flex items-center"
                    onClick={() => setExpanded(!expanded)}
                >
                    <span className={`inline-flex justify-center items-center w-4 h-4 mr-1 text-xs font-bold ${expanded ? 'text-blue-500' : 'text-gray-500'}`}>
                        {expanded ? '▼' : '►'}
                    </span>
                    <span className="text-gray-600">{"{"}</span>
                    {!expanded && <span className="text-gray-500">...</span>}
                </span>
                {expanded && (
                    <div className="pl-6 border-l border-gray-200 ml-1">
                        {keys.map((key, index) => {
                            const value = (data as Record<string, unknown>)[key];
                            return (
                                <div key={key} className="py-0.5">
                                    <span className="text-purple-600 font-medium">"{key}"</span>
                                    <span className="text-gray-600">: </span>
                                    <JsonView data={value} level={level + 1} />
                                    {index < keys.length - 1 && <span className="text-gray-500">,</span>}
                                </div>
                            );
                        })}
                        <div>{"}"}</div>
                    </div>
                )}
                {!expanded && <span className="text-gray-600">{"}"}</span>}
            </div>
        );
    }

    // Fallback for other types
    return <span className="text-red-500">{String(data)}</span>;
};

export function LogDetailsModal({
    log,
    isOpen,
    onClose,
}: LogDetailsModalProps) {
    const { t } = useTranslation();
    const { toast } = useToast();

    // No log selected
    if (!log) return null;

    // Parse the log details
    const parsedDetails = log.details ? safeJsonParse(log.details) : null;

    const formattedDate = log.date_timer
        ? format(new Date(log.date_timer), "PPpp")
        : "";

    const copyDetails = () => {
        if (log.details) {
            navigator.clipboard.writeText(log.details);
            toast({
                title: t("logs.details.copied"),
                description: t("logs.details.copiedDescription"),
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="space-y-4 overflow-y-auto flex-grow">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                                {t("logs.details.user")}
                            </Label>
                            <div>{log.user || "System"}</div>
                        </div>
                        <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                                {t("logs.details.type")}
                            </Label>
                            <div className="capitalize">{log.type_log}</div>
                        </div>
                        <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                                {t("logs.details.field")}
                            </Label>
                            <div>{log.field}</div>
                        </div>
                        <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                                {t("logs.details.date")}
                            </Label>
                            <div>{formattedDate}</div>
                        </div>
                    </div>

                    <div>
                        <Label className="text-sm font-medium text-muted-foreground block mb-1">
                            {t("logs.details.logMessage")}
                        </Label>
                        <div className="text-sm">{log.log}</div>
                    </div>

                    {parsedDetails && (
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <Label className="text-sm font-medium text-muted-foreground">
                                    {t("logs.details.details")}
                                </Label>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={copyDetails}
                                    className="h-7"
                                >
                                    <Copy className="h-3.5 w-3.5 mr-1" />
                                    {t("logs.details.copy")}
                                </Button>
                            </div>
                            <div className="bg-muted/50 p-4 rounded-md overflow-auto max-h-[400px] text-sm font-mono shadow-inner">
                                <JsonView data={parsedDetails} />
                            </div>
                        </div>
                    )}

                    {log.details && !parsedDetails && (
                        <div className="text-red-500">
                            {t("logs.details.invalidJson")}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
} 