import { Bell, ChevronDown, Globe, Menu, SunMoon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTheme } from '@/hooks/use-theme'
import { ROUTES } from '@/constants/routes'
import { removeAuthToken } from '@/lib/auth'
import { useTranslation } from 'react-i18next'

interface TopBarProps {
    onToggleSidebar: () => void
    isSidebarOpen: boolean
}

export function TopBar({ onToggleSidebar, isSidebarOpen }: TopBarProps) {
    const { setTheme } = useTheme();
    const { t, i18n } = useTranslation();

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
            <div className="container flex h-16 items-center">
                <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden mr-2"
                    onClick={onToggleSidebar}
                >
                    <Menu className="h-5 w-5" />
                </Button>

                {!isSidebarOpen && (
                    <img
                        src="https://ecommerce-image-catalog.s3.amazonaws.com/Plaza+Lama/Logo+Plaza+Lama+Border+Blanco.png"
                        alt="Plaza Lama"
                        className="h-8 object-contain ml-4"
                    />
                )}

                <div className="flex-1" />

                <div className="flex items-center gap-2">
                    {/* Theme Switcher */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9">
                                <SunMoon className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32">
                            <DropdownMenuItem onClick={() => setTheme('light')}>
                                {t('common.theme.light')}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme('dark')}>
                                {t('common.theme.dark')}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme('system')}>
                                {t('common.theme.system')}
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
                                {t('common.languages.es')}
                                {i18n.language === 'es' && <span className="text-primary">✓</span>}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleLanguageChange('en')} className="flex items-center justify-between">
                                {t('common.languages.en')}
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
                            <Button variant="ghost" className="h-9 gap-2 pl-2 pr-1">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>JD</AvatarFallback>
                                </Avatar>
                                <ChevronDown className="h-4 w-4 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem>{t('common.profile.profile')}</DropdownMenuItem>
                            <DropdownMenuItem>{t('common.profile.settings')}</DropdownMenuItem>
                            <DropdownMenuItem onClick={handleLogout}>{t('common.profile.logout')}</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
} 