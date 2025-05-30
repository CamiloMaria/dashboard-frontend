import { Bell, ChevronDown, Globe, Menu, SunMoon, User } from 'lucide-react'
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
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'
import { authApi } from '@/api/auth'

interface TopBarProps {
    isSidebarOpen: boolean
    onToggleSidebar: () => void
}

export function TopBar({ isSidebarOpen, onToggleSidebar }: TopBarProps) {
    const { theme, setTheme } = useTheme();
    const { t, i18n } = useTranslation();

    // Enhanced media queries for more precise breakpoint handling
    const isMobile = useMediaQuery('(max-width: 767px)');
    const isMediumTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
    const isLargeTablet = useMediaQuery('(min-width: 1024px) and (max-width: 1279px)');

    // Combined conditions for different view types
    const isTablet = isMediumTablet || isLargeTablet;
    const isCompactView = isMobile || isTablet;

    const handleLogout = async () => {
        await authApi.signOut();
    };

    const handleLanguageChange = (lang: string) => {
        i18n.changeLanguage(lang);
        // Optionally save the language preference
        localStorage.setItem('preferredLanguage', lang);
    };

    // Calculate if the sidebar toggle should be visible
    const showSidebarToggle = isMobile || isTablet || !isSidebarOpen;

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 sm:h-16 items-center px-3 sm:px-4 md:container">
                {/* Menu toggle button - improved visibility logic */}
                {isMobile && (
                    <>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                                "mr-1 flex-shrink-0",
                                !showSidebarToggle && "opacity-0 pointer-events-none"
                            )}
                            onClick={onToggleSidebar}
                            aria-label="Toggle sidebar"
                        >
                            <Menu className="h-5 w-5" />
                        </Button>

                        {/* Logo container with enhanced responsive behavior */}
                        <div className={cn(
                            "flex items-center h-7 overflow-hidden transition-all duration-200",
                            "ml-1 opacity-100 w-auto",
                            "max-w-[100px]"
                        )}>
                            <img
                                src="https://ecommerce-image-catalog.s3.amazonaws.com/Plaza+Lama/Logo+Plaza+Lama+Border+Blanco.png"
                                alt="Plaza Lama"
                                className="h-full object-contain"
                            />
                        </div>
                    </>
                )}

                <div className="flex-1" />

                <div className="flex items-center gap-0.5 sm:gap-1 md:gap-2">
                    {/* Compact view menu dropdown (mobile and tablet) */}
                    {isCompactView && (
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

                    {/* Desktop controls - only visible on larger screens */}
                    {!isCompactView && (
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

                            {/* Notifications */}
                            <Button variant="ghost" size="icon" className="h-9 w-9">
                                <Bell className="h-4 w-4" />
                            </Button>

                            {/* User Profile */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-9 gap-1 sm:gap-2 pl-1 sm:pl-2 pr-1">
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