import { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Package,
    ShoppingCart,
    ChevronDown,
    Menu,
    Box,
    Tags,
    Boxes,
    LucideIcon,
    Shield,
    ScrollText,
    X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import type { Route } from '@tanstack/react-router';
import { ROUTES, BASE_PATH } from '@/constants/routes';
import { useAuth } from '@/hooks/use-auth';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from '@/hooks/use-media-query';

interface NavRoute {
    path: string;
    label: string;
    icon: LucideIcon;
    children?: {
        path: string;
        label: string;
        icon: LucideIcon;
    }[];
}

const navigationConfig: NavRoute[] = [
    // {
    //     path: ROUTES.DASHBOARD,
    //     label: 'common.sidebar.dashboard',
    //     icon: LayoutDashboard,
    // },
    {
        path: ROUTES.INVENTORY.ROOT,
        label: 'common.sidebar.inventory.root',
        icon: Package,
        children: [
            {
                path: ROUTES.INVENTORY.PRODUCTS.LIST,
                label: 'common.sidebar.inventory.products',
                icon: Box,
            },
            {
                path: ROUTES.INVENTORY.PROMOTIONS,
                label: 'common.sidebar.inventory.promotions',
                icon: Tags,
            },
            // {
            //     path: ROUTES.INVENTORY.CATEGORIES,
            //     label: 'Categories',
            //     icon: PackageOpen,
            // },
            // {
            //     path: ROUTES.INVENTORY.ROOT,
            //     label: 'Change Quantity',
            //     icon: PackageCheck,
            // },
            {
                path: ROUTES.INVENTORY.PRODUCT_SETS.LIST,
                label: 'common.sidebar.inventory.productSets',
                icon: Boxes,
            },
        ],
    },
    {
        path: ROUTES.ORDERS,
        label: 'common.sidebar.orders',
        icon: ShoppingCart,
    },
    {
        path: ROUTES.LOGS,
        label: 'common.sidebar.logs',
        icon: ScrollText,
    },
    {
        path: ROUTES.PERMISSIONS,
        label: 'common.sidebar.permissions',
        icon: Shield,
    },
    // {
    //     path: ROUTES.CLIENTS,
    //     label: 'Clients',
    //     icon: Users,
    // },
];

interface SidebarProps {
    isOpen: boolean;
    onToggle: () => void;
}

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    isActive?: boolean;
    isCollapsed?: boolean;
    onClick?: () => void;
    children?: { icon: React.ReactNode; label: string; onClick?: () => void; isActive?: boolean }[];
}

function NavItem({ icon, label, isActive, isCollapsed, onClick, children }: NavItemProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useTranslation();

    // Auto-expand parent items when a child is active
    useEffect(() => {
        if (isActive && children) {
            setIsOpen(true);
        }
    }, [isActive, children]);

    if (children) {
        return (
            <Collapsible open={isOpen || isActive} onOpenChange={setIsOpen}>
                <CollapsibleTrigger asChild>
                    <Button
                        variant={isActive ? 'secondary' : 'ghost'}
                        className={cn(
                            'w-full justify-between h-10 sm:h-9 relative',
                            isCollapsed && 'justify-center px-2',
                            'hover:[background:hsl(240,3.7%,15.9%)]',
                            'active:[background:hsl(240,3.7%,15.9%)]',
                            isActive && '[background:hsl(240,3.7%,15.9%)]'
                        )}
                        onClick={() => {
                            if (isCollapsed) {
                                setIsOpen(!isOpen);
                            }
                            onClick?.();
                        }}
                    >
                        <span className="flex items-center gap-2">
                            {icon}
                            {!isCollapsed && <span className="text-white">{t(label)}</span>}
                        </span>
                        {!isCollapsed && (
                            <ChevronDown
                                className={cn(
                                    "h-4 w-4 transition-transform duration-200 text-white",
                                    (isOpen || isActive) ? "rotate-0" : "-rotate-90"
                                )}
                            />
                        )}
                        {isActive && !isCollapsed && (
                            <span className="absolute left-0 top-1 bottom-1 w-1 bg-white rounded-r-full" />
                        )}
                    </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className={cn("pl-4 pb-1", isCollapsed && "pl-2")}>
                    {children.map((child, index) => (
                        <Button
                            key={index}
                            variant={child.isActive ? 'secondary' : 'ghost'}
                            className={cn(
                                "w-full justify-start gap-2 h-10 sm:h-9 px-2 mb-1 relative",
                                'hover:[background:hsl(240,3.7%,15.9%)]',
                                'active:[background:hsl(240,3.7%,15.9%)]',
                                child.isActive && "[background:hsl(240,3.7%,15.9%)]",
                                isCollapsed && "justify-center"
                            )}
                            onClick={child.onClick}
                        >
                            {child.icon}
                            {!isCollapsed && <span className="text-sm text-white">{t(child.label)}</span>}
                            {child.isActive && !isCollapsed && (
                                <span className="absolute left-0 top-1 bottom-1 w-1 bg-white rounded-r-full" />
                            )}
                        </Button>
                    ))}
                </CollapsibleContent>
            </Collapsible>
        );
    }

    return (
        <Button
            variant={isActive ? 'secondary' : 'ghost'}
            className={cn(
                'w-full justify-start gap-2 h-10 sm:h-9 relative',
                isCollapsed && 'justify-center px-2',
                'hover:[background:hsl(240,3.7%,15.9%)]',
                'active:[background:hsl(240,3.7%,15.9%)]',
                isActive && '[background:hsl(240,3.7%,15.9%)]'
            )}
            onClick={onClick}
        >
            {icon}
            {!isCollapsed && <span className="text-sm text-white">{t(label)}</span>}
            {isActive && !isCollapsed && (
                <span className="absolute left-0 top-1 bottom-1 w-1 bg-white rounded-r-full" />
            )}
        </Button>
    );
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
    const navigate = useNavigate();
    const routerState = useRouterState();
    const currentPath = routerState.location.pathname;
    const { hasAccess } = useAuth();

    // Enhanced breakpoint detection with more granular sizes
    const isMobile = useMediaQuery('(max-width: 767px)');
    const isMediumTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
    const isLargeTablet = useMediaQuery('(min-width: 1024px) and (max-width: 1279px)');

    // Combined conditions for different view types
    const isTablet = isMediumTablet || isLargeTablet;
    const isIntermediateView = isMediumTablet; // Specific handling for problematic sizes
    const isCompactView = isMobile || isTablet;

    const [showMobileOverlay, setShowMobileOverlay] = useState(false);

    // Handle mobile sidebar visibility
    useEffect(() => {
        if (isCompactView) {
            setShowMobileOverlay(isOpen);

            // Prevent body scroll when sidebar is open on mobile
            if (isOpen) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        } else {
            setShowMobileOverlay(false);
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen, isCompactView]);

    const isRouteActive = (path: string) => {
        if (path === BASE_PATH) {
            return currentPath === path;
        }
        return currentPath.startsWith(path);
    };

    const handleNavigate = (path: string) => {
        navigate({ to: path as Route['path'] });
        // Close sidebar on navigation for mobile and tablet
        if (isCompactView) {
            onToggle();
        }
    };

    const filteredNavigation = navigationConfig.filter(item => {
        if (!hasAccess(item.path)) return false;
        if (item.children) {
            item.children = item.children.filter(child => hasAccess(child.path));
            return item.children.length > 0;
        }
        return true;
    });

    // More refined sidebar width calculation based on screen size
    let sidebarWidth = 'w-64'; // Default full width
    let collapsedWidth = 'w-16'; // Default collapsed width

    if (isLargeTablet) {
        sidebarWidth = 'w-56';
        collapsedWidth = 'w-14';
    } else if (isMediumTablet) {
        sidebarWidth = 'w-52';
        collapsedWidth = 'w-12';
    } else if (isMobile) {
        sidebarWidth = 'w-64';
        collapsedWidth = 'w-0';
    }

    return (
        <>
            {/* Mobile overlay with improved z-index handling */}
            {showMobileOverlay && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                    onClick={onToggle}
                    aria-hidden="true"
                />
            )}

            <aside
                className={cn(
                    'fixed left-0 top-0 z-50 h-screen border-r bg-backgroundSecondary transition-all duration-300',
                    isOpen ? sidebarWidth : collapsedWidth,
                    // Enhanced transform logic with better handling for intermediate sizes
                    isCompactView && !isOpen && 'translate-x-[-100%]',
                    isIntermediateView && !isOpen && 'sm:translate-x-[-100%] md:translate-x-0',
                    !isIntermediateView && !isMobile && !isOpen && 'translate-x-0',
                    isCompactView && isOpen && 'translate-x-0',
                    'shadow-lg'
                )}
            >
                <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4 border-b">
                    {isOpen && (
                        <img
                            src="https://ecommerce-image-catalog.s3.amazonaws.com/Plaza+Lama/Logo+Plaza+Lama+Border+Blanco.png"
                            alt="Plaza Lama"
                            className={cn(
                                "h-auto object-contain transition-opacity duration-300",
                                isMobile ? "max-h-5 max-w-[100px]" :
                                    isMediumTablet ? "max-h-6 max-w-[120px]" :
                                        "max-h-7 max-w-[140px]"
                            )}
                        />
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onToggle}
                        className={cn('h-9 w-9', !isOpen && 'mx-auto', 'text-white')}
                        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
                    >
                        {isOpen ? (
                            <X className="h-4 w-4" />
                        ) : (
                            <Menu className={cn("h-4 w-4")} />
                        )}
                    </Button>
                </div>

                <ScrollArea className="h-[calc(100vh-4rem)] px-2 sm:px-3 py-3 sm:py-4">
                    <div className="space-y-1 sm:space-y-2">
                        {filteredNavigation.map((item) => (
                            <NavItem
                                key={item.path}
                                icon={<item.icon className="h-4 w-4 text-white" />}
                                label={item.label}
                                isActive={isRouteActive(item.path)}
                                isCollapsed={!isOpen}
                                onClick={item.children ? undefined : () => handleNavigate(item.path)}
                                children={
                                    item.children?.map((child) => ({
                                        icon: <child.icon className="h-4 w-4 text-white" />,
                                        label: child.label,
                                        onClick: () => handleNavigate(child.path),
                                        isActive: isRouteActive(child.path),
                                    }))
                                }
                            />
                        ))}
                    </div>
                </ScrollArea>

                {/* Logo at bottom - only show when sidebar is collapsed on desktop */}
                {(!isOpen && !isCompactView) && (
                    <div className="absolute bottom-4 left-0 right-0 px-4">
                        <Box className="h-4 w-4 mx-auto text-white" />
                    </div>
                )}
            </aside>
        </>
    );
}