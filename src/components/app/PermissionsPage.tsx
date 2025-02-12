import { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { permissionsApi } from "@/api/permissions";
import { Search, Loader2, ChevronRight } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { PaginationControls } from './products-table/PaginationControls';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebounce } from '@/hooks/use-debounce';
import { ScrollArea } from '@/components/ui/scroll-area';

interface User {
    id: string;
    username: string;
    codigo: string;
    allowedPages: string[];
}

interface RouteConfig {
    path: string;
    label: string;
    children?: RouteConfig[];
}

const availableRoutes: RouteConfig[] = [
    { path: ROUTES.DASHBOARD, label: 'Dashboard' },
    {
        path: ROUTES.INVENTORY.ROOT,
        label: 'Inventory',
        children: [
            {
                path: ROUTES.INVENTORY.PRODUCTS.LIST,
                label: 'Products',
                children: [
                    { path: ROUTES.INVENTORY.PRODUCTS.NEW, label: 'Create Products' },
                    { path: ROUTES.INVENTORY.PRODUCTS.EDITOR, label: 'Edit Products' },
                ]
            },
            { path: ROUTES.INVENTORY.PROMOTIONS, label: 'Promotions' },
            {
                path: ROUTES.INVENTORY.PRODUCT_SETS.LIST,
                label: 'Product Sets',
                children: [
                    { path: ROUTES.INVENTORY.PRODUCT_SETS.NEW, label: 'Create Product Sets' },
                ]
            },
        ]
    },
    { path: ROUTES.ORDERS, label: 'Orders' },
    { path: ROUTES.PERMISSIONS, label: 'Permissions' },
];

function getAllChildPaths(route: RouteConfig): string[] {
    const paths = [route.path];
    if (route.children) {
        route.children.forEach(child => {
            paths.push(...getAllChildPaths(child));
        });
    }
    return paths;
}

function RoutePermissionItem({ route, depth = 0, selectedUser, onToggle }: {
    route: RouteConfig;
    depth?: number;
    selectedUser: User;
    onToggle: (path: string) => void;
}) {
    const [isOpen, setIsOpen] = useState(true);
    const allChildPaths = route.children ? getAllChildPaths(route) : [route.path];
    const isChecked = selectedUser.allowedPages.includes(route.path);
    const isPartiallyChecked = route.children &&
        allChildPaths.some(path => selectedUser.allowedPages.includes(path)) &&
        !allChildPaths.every(path => selectedUser.allowedPages.includes(path));

    return (
        <div className="space-y-1">
            <div
                className={cn(
                    "flex items-center gap-2 py-1 px-2 rounded-md hover:bg-accent/50 transition-colors",
                    (isChecked || isPartiallyChecked) && "bg-accent/30"
                )}
                style={{ paddingLeft: `${depth * 16 + 8}px` }}
            >
                {route.children ? (
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ChevronRight className={cn(
                            "h-4 w-4 transition-transform duration-200",
                            isOpen && "rotate-90"
                        )} />
                    </button>
                ) : (
                    <div className="w-4" />
                )}
                <div className="flex items-center gap-2 flex-1">
                    <Checkbox
                        id={route.path}
                        checked={isChecked}
                        className={cn(isPartiallyChecked && "opacity-70")}
                        onCheckedChange={() => onToggle(route.path)}
                    />
                    <Label
                        htmlFor={route.path}
                        className={cn(
                            "cursor-pointer select-none",
                            route.children && "font-medium"
                        )}
                    >
                        {route.label}
                    </Label>
                </div>
            </div>
            {route.children && isOpen && (
                <div className="ml-2 border-l pl-2">
                    {route.children.map(child => (
                        <RoutePermissionItem
                            key={child.path}
                            route={child}
                            depth={depth + 1}
                            selectedUser={selectedUser}
                            onToggle={onToggle}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export function PermissionsPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [, startTransition] = useTransition();
    const { toast } = useToast();

    const debouncedSearch = useDebounce(searchTerm);

    const { data, isFetching } = useQuery({
        queryKey: ['users', { page: currentPage, limit: itemsPerPage, search: debouncedSearch }],
        queryFn: () => permissionsApi.getAllUsers({
            page: currentPage,
            limit: itemsPerPage,
            search: debouncedSearch,
            order: 'asc',
            sortBy: 'codigo',
        }),
        placeholderData: keepPreviousData,
        staleTime: 5000,
    });

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (value !== searchTerm) {
            setCurrentPage(1);
        }
    };

    const handlePageChange = (newPage: number) => {
        startTransition(() => {
            setCurrentPage(newPage);
        });
    };

    const handleItemsPerPageChange = (newItemsPerPage: number) => {
        startTransition(() => {
            setItemsPerPage(newItemsPerPage);
            setCurrentPage(1);
        });
    };

    const handleRouteToggle = (path: string) => {
        if (!selectedUser) return;

        setSelectedUser(prev => {
            if (!prev) return null;

            // Find the route config for this path
            const findRoute = (routes: RouteConfig[], parentPaths: string[] = []): [RouteConfig | undefined, string[]] => {
                for (const route of routes) {
                    if (route.path === path) return [route, [...parentPaths, route.path]];
                    if (route.children) {
                        const [found, paths] = findRoute(route.children, [...parentPaths, route.path]);
                        if (found) return [found, paths];
                    }
                }
                return [undefined, []];
            };

            const [routeToToggle, parentPaths] = findRoute(availableRoutes);
            if (!routeToToggle) return prev;

            const allChildPaths = getAllChildPaths(routeToToggle);
            const isCurrentlyChecked = prev.allowedPages.includes(path);

            let updatedPages: string[];
            if (isCurrentlyChecked) {
                // Remove this path and all child paths
                updatedPages = prev.allowedPages.filter(p => !allChildPaths.includes(p));
            } else {
                // Add this path, all parent paths, and all child paths
                updatedPages = [...new Set([...prev.allowedPages, ...parentPaths, ...allChildPaths])];
            }

            return { ...prev, allowedPages: updatedPages };
        });
    };

    const handleSave = async () => {
        if (!selectedUser) return;

        try {
            setIsLoading(true);
            await permissionsApi.saveUserPermissions(selectedUser);
            toast({
                title: "Success",
                description: "User permissions saved successfully",
            });
        } catch (err) {
            console.error('Failed to save permissions:', err);
            toast({
                title: "Error",
                description: "Failed to save user permissions",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!data) return null;

    const { data: users, pagination } = data;
    const totalPages = Math.ceil(pagination.length / itemsPerPage);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">User Permissions</h1>
                <p className="text-muted-foreground mt-2">
                    Manage user access to different sections of the dashboard
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Users</CardTitle>
                        <CardDescription>Select a user to manage their permissions</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-4">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by username or code"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="pl-8"
                                />
                            </div>

                            <ScrollArea className="relative">
                                {isFetching && (
                                    <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50">
                                        <div className="bg-background p-4 rounded-lg shadow-lg">
                                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                        </div>
                                    </div>
                                )}

                                <div className="rounded-lg border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Username</TableHead>
                                                <TableHead>Code</TableHead>
                                                <TableHead>Permissions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {users.map(user => (
                                                <TableRow
                                                    key={user.username}
                                                    className={cn(
                                                        "cursor-pointer hover:bg-accent",
                                                        selectedUser?.username === user.username && "bg-accent"
                                                    )}
                                                    onClick={() => setSelectedUser(user)}
                                                >
                                                    <TableCell className="font-medium">{user.username}</TableCell>
                                                    <TableCell>{user.codigo}</TableCell>
                                                    <TableCell>{user.allowedPages.length} pages</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>

                                    <PaginationControls
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        itemsPerPage={itemsPerPage}
                                        onPageChange={handlePageChange}
                                        onItemsPerPageChange={handleItemsPerPageChange}
                                    />
                                </div>
                            </ScrollArea>
                        </div>
                    </CardContent>
                </Card>

                {selectedUser && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Permissions for {selectedUser.username}</CardTitle>
                            <CardDescription>Select which pages this user can access</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {availableRoutes.map(route => (
                                <RoutePermissionItem
                                    key={route.path}
                                    route={route}
                                    selectedUser={selectedUser}
                                    onToggle={handleRouteToggle}
                                />
                            ))}
                            <Button
                                className="w-full"
                                onClick={handleSave}
                                disabled={isLoading}
                            >
                                {isLoading ? "Saving..." : "Save Permissions"}
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
} 