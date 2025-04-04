import { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { ROUTES_WITHOUT_BASE } from "@/constants/routes";
import { cn } from "@/lib/utils";
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
import { User, UserSortField } from '@/types/auth';
import { authApi } from '@/api';

interface RouteConfig {
    label: string;
    path?: string;
    children?: RouteConfig[];
}

const availableRoutes: RouteConfig[] = [
    {
        path: ROUTES_WITHOUT_BASE.INVENTORY.ROOT,
        label: 'Inventory',
        children: [
            {
                label: 'Products',
                children: [
                    { path: ROUTES_WITHOUT_BASE.INVENTORY.PRODUCTS.LIST, label: 'View Products' },
                    { path: ROUTES_WITHOUT_BASE.INVENTORY.PRODUCTS.NEW, label: 'Create Products' },
                    { path: ROUTES_WITHOUT_BASE.INVENTORY.PRODUCTS.EDITOR, label: 'Edit Products' },
                ]
            },
            { path: ROUTES_WITHOUT_BASE.INVENTORY.PROMOTIONS, label: 'Promotions' },
            {
                label: 'Product Sets',
                children: [
                    { path: ROUTES_WITHOUT_BASE.INVENTORY.PRODUCT_SETS.LIST, label: 'View Product Sets' },
                    { path: ROUTES_WITHOUT_BASE.INVENTORY.PRODUCT_SETS.NEW, label: 'Create Product Sets' },
                ]
            },
        ]
    },
    {
        label: 'Orders',
        children: [
            { path: ROUTES_WITHOUT_BASE.ORDERS, label: 'View Orders' },
            { path: '/orders:print', label: 'Print Orders' },
        ]
    },
    { path: ROUTES_WITHOUT_BASE.LOGS, label: 'Logs' },
    { path: ROUTES_WITHOUT_BASE.PERMISSIONS, label: 'Permissions' },
];

function getAllChildPaths(route: RouteConfig): string[] {
    const paths: string[] = [];

    // Only add the path if it's defined
    if (route.path) {
        paths.push(route.path);
    }

    if (route.children) {
        route.children.forEach(child => {
            // Get child paths and filter out any undefined values
            const childPaths = getAllChildPaths(child);
            paths.push(...childPaths);
        });
    }

    return paths;
}

function RoutePermissionItem({ route, depth = 0, selectedUser, onToggle }: {
    route: RouteConfig;
    depth?: number;
    selectedUser: User;
    onToggle: (path: string, isParentToggle?: boolean) => void;
}) {
    const [isOpen, setIsOpen] = useState(true);
    const allChildPaths = route.children ? getAllChildPaths(route) : (route.path ? [route.path] : []);

    // For routes with a path, check if it's included in allowedPages
    // For routes without a path but with children, check if ALL children's paths are included
    const isChecked = route.path
        ? selectedUser.allowedPages.includes(route.path)
        : (route.children && allChildPaths.length > 0
            ? allChildPaths.every(path => selectedUser.allowedPages.includes(path))
            : false);

    // Only apply to routes with children and check if SOME but not ALL children are included
    const isPartiallyChecked = route.children && allChildPaths.length > 0 &&
        allChildPaths.some(path => selectedUser.allowedPages.includes(path)) &&
        !allChildPaths.every(path => selectedUser.allowedPages.includes(path));

    // Handler for toggling parent items without paths
    const handleToggle = () => {
        if (route.path) {
            // For top-level routes with paths and children (like Inventory), treat as parent toggle
            if (route.children && route.children.length > 0) {
                onToggle(route.path, true);
            } else {
                // For routes with paths but no children, it's a direct toggle
                onToggle(route.path, false);
            }
        } else if (route.children && allChildPaths.length > 0) {
            // For a parent without a path, toggle all child paths
            // Indicate this is a parent toggle with isParentToggle=true
            const firstPath = allChildPaths[0];
            if (firstPath) {
                onToggle(firstPath, true);
            }
        }
    };

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
                        id={route.path || `route-${route.label}`}
                        checked={isChecked}
                        className={cn(isPartiallyChecked && "opacity-70")}
                        onCheckedChange={handleToggle}
                    />
                    <Label
                        htmlFor={route.path || `route-${route.label}`}
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
                            key={child.path || `child-${child.label}`}
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
        queryFn: () => authApi.getAllUsers({
            page: currentPage,
            limit: itemsPerPage,
            search: debouncedSearch,
            sortOrder: 'asc',
            sortBy: UserSortField.CODE,
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

    const handleRouteToggle = (path: string, isParentToggle?: boolean) => {
        if (!selectedUser) return;

        setSelectedUser(prev => {
            if (!prev) return null;

            // Find the route config for this path
            const findRoute = (routes: RouteConfig[], parentPaths: string[] = []): [RouteConfig | undefined, string[]] => {
                for (const route of routes) {
                    if (route.path === path) {
                        // Only include defined paths in parentPaths
                        const updatedParentPaths = [...parentPaths];
                        if (route.path) {
                            updatedParentPaths.push(route.path);
                        }
                        return [route, updatedParentPaths];
                    }
                    if (route.children) {
                        // Only include defined paths in parentPaths
                        const childParentPaths = [...parentPaths];
                        if (route.path) {
                            childParentPaths.push(route.path);
                        }
                        const [found, paths] = findRoute(route.children, childParentPaths);
                        if (found) return [found, paths];
                    }
                }
                return [undefined, []];
            };

            const [routeToToggle, parentPaths] = findRoute(availableRoutes);
            if (!routeToToggle) return prev;

            const allChildPaths = getAllChildPaths(routeToToggle);
            const isCurrentlyChecked = prev.allowedPages.includes(path);

            // Find the parent route if this is a child path
            const findParentRoute = (routes: RouteConfig[], targetPath: string, currentPath: RouteConfig[] = []): RouteConfig[] => {
                for (const route of routes) {
                    const currentWithRoute = [...currentPath, route];

                    if (route.path === targetPath) {
                        return currentWithRoute;
                    }

                    if (route.children) {
                        const found = findParentRoute(route.children, targetPath, currentWithRoute);
                        if (found.length > 0) return found;
                    }
                }
                return [];
            };

            const routePath = findParentRoute(availableRoutes, path);
            const parentRoute = routePath.length > 1 ? routePath[routePath.length - 2] : null;

            // For a parent toggle without a path, get all sibling paths to handle group selection
            let siblingPaths: string[] = [];
            if (isParentToggle && parentRoute && !parentRoute.path && parentRoute.children) {
                siblingPaths = getAllChildPaths(parentRoute);
            }

            let updatedPages: string[];
            if (isCurrentlyChecked) {
                // For parent toggle with path and children, remove all child paths too
                if (isParentToggle && routeToToggle.path && routeToToggle.children) {
                    const allPaths = getAllChildPaths(routeToToggle);
                    updatedPages = prev.allowedPages.filter(p => !allPaths.includes(p));
                } else {
                    // Remove this path and all child paths
                    updatedPages = prev.allowedPages.filter(p => !allChildPaths.includes(p));
                }

                // If this is a parent toggle of a parent without a path, also remove sibling paths
                if (siblingPaths.length > 0) {
                    updatedPages = updatedPages.filter(p => !siblingPaths.includes(p));
                }
            } else {
                // For parent toggle with path and children, add all child paths too
                if (isParentToggle && routeToToggle.path && routeToToggle.children) {
                    const allPaths = getAllChildPaths(routeToToggle);
                    updatedPages = [...new Set([...prev.allowedPages, ...allPaths])];
                } else {
                    // Add this path, all parent paths, and all child paths
                    updatedPages = [...new Set([...prev.allowedPages, ...parentPaths, ...allChildPaths])];
                }

                // If this is a parent toggle of a parent without a path, also add all sibling paths
                if (siblingPaths.length > 0) {
                    updatedPages = [...new Set([...updatedPages, ...siblingPaths])];
                }
            }

            return { ...prev, allowedPages: updatedPages };
        });
    };

    const handleSave = async () => {
        if (!selectedUser) return;

        try {
            setIsLoading(true);
            await authApi.saveUserPermissions({
                username: selectedUser.username,
                allowedPages: selectedUser.allowedPages,
            });
            toast({
                title: "Success",
                description: "User permissions saved successfully",
            });
        } catch {
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

    const { data: users, meta } = data;
    const totalPages = meta.pagination.totalPages;

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