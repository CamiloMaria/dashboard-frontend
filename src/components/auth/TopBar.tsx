import { useTheme } from "@/hooks/use-theme";
import { Button } from "../ui/button";
import { SunMoon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

export function TopBar() {
    const { setTheme } = useTheme();

    return (
        <div className="fixed top-0 right-0 p-6 z-50">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-11 w-11 rounded-full border-0 bg-background/95 shadow-md hover:bg-accent backdrop-blur supports-[backdrop-filter]:bg-background/60"
                    >
                        <SunMoon className="h-5 w-5" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={() => setTheme('light')} className="py-2">
                        <span className="text-base">Light</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('dark')} className="py-2">
                        <span className="text-base">Dark</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('system')} className="py-2">
                        <span className="text-base">System</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}