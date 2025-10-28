import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "./ThemeProvider";
import { 
  Users, 
  Briefcase, 
  Rocket, 
  MessageSquare, 
  Settings, 
  Sun, 
  Moon, 
  User, 
  LogOut 
} from "lucide-react";
import avatar1 from "@assets/generated_images/Student_profile_avatar_1_237efb63.png";

export function Navigation() {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { path: "/", label: "Home", icon: null },
    { path: "/team-matching", label: "Team Matching", icon: Users },
    { path: "/project-gigs", label: "Project Gigs", icon: Briefcase },
    { path: "/startup-showcase", label: "Startup Showcase", icon: Rocket },
    { path: "/messages", label: "Messages", icon: MessageSquare },
    { path: "/admin", label: "Admin Panel", icon: Settings },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <Link href="/">
              <a className="flex items-center gap-2 hover-elevate active-elevate-2 rounded-lg px-2 py-1" data-testid="link-home">
                <Rocket className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold text-foreground">
                  Foundry StartupMatch
                </span>
              </a>
            </Link>
            
            <div className="hidden md:flex items-center gap-1">
              {navItems.slice(1).map((item) => {
                const Icon = item.icon;
                const isActive = location === item.path;
                return (
                  <Link key={item.path} href={item.path}>
                    <a data-testid={`link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={isActive ? "bg-secondary" : ""}
                      >
                        {Icon && <Icon className="h-4 w-4 mr-2" />}
                        {item.label}
                      </Button>
                    </a>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              data-testid="button-theme-toggle"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full" data-testid="button-user-menu">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={avatar1} alt="User" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem data-testid="menu-profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem data-testid="menu-settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem data-testid="menu-logout">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
