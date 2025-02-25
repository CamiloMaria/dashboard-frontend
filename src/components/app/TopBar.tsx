import { Bell, ChevronDown, Globe, SunMoon, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { useTheme } from '@/hooks/use-theme'
import { ROUTES } from '@/constants/routes'
import { removeAuthToken } from '@/lib/auth'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'

interface TopBarProps {
    isSidebarOpen: boolean
}

export function TopBar({ isSidebarOpen }: TopBarProps) {
    const { theme, setTheme } = useTheme();
    const { t, i18n } = useTranslation();
    const isMobile = useMediaQuery('(max-width: 640px)');
    const isTablet = useMediaQuery('(max-width: 1224px)');

    const handleLogout = () => {
        removeAuthToken();
        // Force a router state reset before navigation
        window.location.href = ROUTES.AUTH.LOGIN;
    };

    const handleLanguageChange = (lang: string) => {
        i18n.changeLanguage(lang);
        // Optionally save the language preference
        localStorage.setItem('preferredLanguage', lang);
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center px-4 md:container">
                {/* Menu toggle button - only visible on mobile/tablet or when sidebar is closed */}
                {/* <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        "mr-2 flex-shrink-0",
                        isSidebarOpen && !isMobile && !isTablet && "invisible"
                    )}
                    onClick={onToggleSidebar}
                    aria-label="Toggle sidebar"
                >
                    <Menu className="h-5 w-5" />
                </Button> */}

                {/* Logo container with flex layout for better positioning */}
                <div className={cn(
                    "flex items-center h-8 overflow-hidden",
                    isSidebarOpen && !isMobile && !isTablet ? "ml-0" : "ml-2",
                    isMobile ? "max-w-[140px]" : isTablet ? "max-w-[160px]" : "max-w-[180px]"
                )}>
                    {(!isSidebarOpen || isMobile || isTablet) && (
                        <img
                            src="https://ecommerce-image-catalog.s3.amazonaws.com/Plaza+Lama/Logo+Plaza+Lama+Border+Blanco.png"
                            alt="Plaza Lama"
                            className="h-full object-contain"
                        />
                    )}
                </div>

                <div className="flex-1" />

                <div className="flex items-center gap-1 sm:gap-2">
                    {/* Mobile menu dropdown */}
                    {isMobile && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-9 w-9">
                                    <User className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <div className="flex items-center justify-between px-2 py-1.5">
                                    <span className="text-sm font-medium">{t('common.profile.settings')}</span>
                                </div>
                                <DropdownMenuSeparator />

                                {/* Theme options */}
                                <div className="px-2 py-1.5">
                                    <p className="text-xs font-medium text-muted-foreground mb-1.5">{t('common.theme.title') || 'Theme'}</p>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant={theme === 'light' ? 'default' : 'outline'}
                                            size="sm"
                                            className="h-8 flex-1"
                                            onClick={() => setTheme('light')}
                                        >
                                            {t('common.theme.light') || 'Light'}
                                        </Button>
                                        <Button
                                            variant={theme === 'dark' ? 'default' : 'outline'}
                                            size="sm"
                                            className="h-8 flex-1"
                                            onClick={() => setTheme('dark')}
                                        >
                                            {t('common.theme.dark') || 'Dark'}
                                        </Button>
                                    </div>
                                </div>

                                {/* Language options */}
                                <div className="px-2 py-1.5">
                                    <p className="text-xs font-medium text-muted-foreground mb-1.5">{t('common.languages.title') || 'Language'}</p>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant={i18n.language === 'es' ? 'default' : 'outline'}
                                            size="sm"
                                            className="h-8 flex-1"
                                            onClick={() => handleLanguageChange('es')}
                                        >
                                            {t('common.languages.es') || 'Spanish'}
                                        </Button>
                                        <Button
                                            variant={i18n.language === 'en' ? 'default' : 'outline'}
                                            size="sm"
                                            className="h-8 flex-1"
                                            onClick={() => handleLanguageChange('en')}
                                        >
                                            {t('common.languages.en') || 'English'}
                                        </Button>
                                    </div>
                                </div>

                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-950/20">
                                    {t('common.profile.logout') || 'Logout'}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    {/* Tablet/Desktop controls */}
                    {!isMobile && (
                        <>
                            {/* Theme Switcher */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-9 w-9">
                                        <SunMoon className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-32">
                                    <DropdownMenuItem onClick={() => setTheme('light')}>
                                        {t('common.theme.light') || 'Light'}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTheme('dark')}>
                                        {t('common.theme.dark') || 'Dark'}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTheme('system')}>
                                        {t('common.theme.system') || 'System'}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Language Switcher */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-9 w-9">
                                        <Globe className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-32">
                                    <DropdownMenuItem onClick={() => handleLanguageChange('es')} className="flex items-center justify-between">
                                        {t('common.languages.es') || 'Spanish'}
                                        {i18n.language === 'es' && <span className="text-primary">✓</span>}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleLanguageChange('en')} className="flex items-center justify-between">
                                        {t('common.languages.en') || 'English'}
                                        {i18n.language === 'en' && <span className="text-primary">✓</span>}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Notifications - hidden on smaller tablets */}
                            <Button variant="ghost" size="icon" className={cn("h-9 w-9", isTablet && "hidden sm:flex")}>
                                <Bell className="h-4 w-4" />
                            </Button>

                            {/* User Profile */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-9 gap-2 pl-2 pr-1">
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage src="https://github.com/shadcn.png" />
                                            <AvatarFallback>JD</AvatarFallback>
                                        </Avatar>
                                        <ChevronDown className="h-4 w-4 opacity-50" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-40">
                                    <DropdownMenuItem>{t('common.profile.profile') || 'Profile'}</DropdownMenuItem>
                                    <DropdownMenuItem>{t('common.profile.settings') || 'Settings'}</DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleLogout}>{t('common.profile.logout') || 'Logout'}</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
} 