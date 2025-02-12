import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

interface User {
    username: string;
    allowedPages: string[];
}

const availableRoutes = [
    { path: ROUTES.DASHBOARD, label: 'Dashboard' },
    { path: ROUTES.INVENTORY.PRODUCTS.LIST, label: 'Products List' },
    { path: ROUTES.INVENTORY.PRODUCTS.NEW, label: 'Create Products' },
    { path: ROUTES.INVENTORY.PROMOTIONS, label: 'Promotions' },
    { path: ROUTES.INVENTORY.PRODUCT_SETS.LIST, label: 'Product Sets' },
    { path: ROUTES.INVENTORY.PRODUCT_SETS.NEW, label: 'Create Product Sets' },
    { path: ROUTES.ORDERS, label: 'Orders' },
];

export function PermissionsPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [username, setUsername] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const { toast } = useToast();

    const handleAddUser = () => {
        if (!username.trim()) {
            toast({
                title: "Error",
                description: "Username is required",
                variant: "destructive",
            });
            return;
        }

        const newUser: User = {
            username: username.trim(),
            allowedPages: [],
        };

        setUsers(prev => [...prev, newUser]);
        setUsername('');
        setSelectedUser(newUser);
    };

    const handleRouteToggle = (path: string) => {
        if (!selectedUser) return;

        setUsers(prev => prev.map(user => {
            if (user.username === selectedUser.username) {
                const updatedPages = user.allowedPages.includes(path)
                    ? user.allowedPages.filter(p => p !== path)
                    : [...user.allowedPages, path];

                const updatedUser = { ...user, allowedPages: updatedPages };
                setSelectedUser(updatedUser);
                return updatedUser;
            }
            return user;
        }));
    };

    const handleSave = async () => {
        try {
            // TODO: Implement API call to save user permissions
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
        }
    };

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
                        <CardDescription>Add and select users to manage their permissions</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Enter username"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                            />
                            <Button onClick={handleAddUser}>Add User</Button>
                        </div>
                        <div className="space-y-2">
                            {users.map(user => (
                                <div
                                    key={user.username}
                                    className={cn(
                                        "p-2 rounded cursor-pointer hover:bg-accent",
                                        selectedUser?.username === user.username && "bg-accent"
                                    )}
                                    onClick={() => setSelectedUser(user)}
                                >
                                    {user.username}
                                </div>
                            ))}
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
                                <div key={route.path} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={route.path}
                                        checked={selectedUser.allowedPages.includes(route.path)}
                                        onCheckedChange={() => handleRouteToggle(route.path)}
                                    />
                                    <Label htmlFor={route.path}>{route.label}</Label>
                                </div>
                            ))}
                            <Button className="w-full" onClick={handleSave}>Save Permissions</Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
} 