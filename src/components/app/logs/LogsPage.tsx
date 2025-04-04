import { useQuery } from "@tanstack/react-query";
import { LogsTable } from "./LogsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { logKeys } from "@/api/query-keys";
import { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { PaginationControls } from "@/components/app/products-table/PaginationControls";
import { authApi } from "@/api/auth";

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50, 100];
const DEFAULT_ITEMS_PER_PAGE = ITEMS_PER_PAGE_OPTIONS[0];

export function LogsPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 300);
    const { t } = useTranslation();

    const { data, isLoading } = useQuery({
        queryKey: logKeys.list({ page: currentPage, limit: itemsPerPage, search: debouncedSearch }),
        queryFn: () => authApi.getLogs({
            page: currentPage,
            limit: itemsPerPage,
            search: debouncedSearch
        }),
    });

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (newItemsPerPage: number) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1); // Reset to first page when changing items per page
    };

    if (!data) return null;

    const { data: logs, meta } = data;
    const totalPages = meta.pagination.totalPages;

    return (
        <Card>
            <CardHeader>
                <CardTitle>System Logs</CardTitle>
                <div className="flex items-center space-x-2">
                    <Input
                        placeholder={t("common.search")}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-sm"
                    />
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                ) : (
                    <>
                        <LogsTable logs={logs || []} />
                        <div className="mt-4">
                            <PaginationControls
                                currentPage={currentPage}
                                totalPages={totalPages}
                                itemsPerPage={itemsPerPage}
                                onPageChange={handlePageChange}
                                onItemsPerPageChange={handleItemsPerPageChange}
                            />
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
} 