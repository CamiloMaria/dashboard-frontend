import { useState, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ROUTES } from '@/constants/routes';
import { Eye, EyeOff } from 'lucide-react';
import { authApi } from '@/api/auth';
import { useToast } from '@/hooks/use-toast';

export function LoginPage() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const passwordInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await authApi.signIn(formData);
            navigate({ to: ROUTES.INVENTORY.PRODUCTS.LIST });
        } catch {
            toast({
                title: 'Error',
                description: 'Invalid username or password',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
        // Ensure the input maintains focus after state update
        requestAnimationFrame(() => {
            passwordInputRef.current?.focus();
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-[400px] space-y-6">
                {/* Logo */}
                <div className="flex justify-center">
                    <img
                        src="https://ecommerce-image-catalog.s3.amazonaws.com/Plaza+Lama/Logo+Plaza+Lama+Border+Blanco.png"
                        alt="Plaza Lama"
                        className="h-12 object-contain"
                    />
                </div>

                <Card>
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
                        <CardDescription className="text-center">
                            Enter your credentials to access your account
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    name="username"
                                    type="text"
                                    placeholder="username"
                                    required
                                    disabled={isLoading}
                                    value={formData.username}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        ref={passwordInputRef}
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        disabled={isLoading}
                                        value={formData.password}
                                        onChange={handleInputChange}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={togglePasswordVisibility}
                                        tabIndex={-1}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-4">
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? "Signing in..." : "Sign in"}
                            </Button>
                            <Button
                                type="button"
                                variant="link"
                                className="text-sm text-muted-foreground"
                                onClick={() => {
                                    // TODO: Implement forgot password logic here
                                }}
                                disabled={isLoading}
                            >
                                Forgot your password?
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
} 