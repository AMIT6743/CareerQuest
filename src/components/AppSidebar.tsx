import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  Phone,
  User,
  Users,
  FileText,
  TrendingUp,
  LogOut,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  currentScreen: string;
  onScreenChange: (screen: string) => void;
  className?: string;
}

const menuItems = [
  {
    title: "Leaderboard",
    icon: TrendingUp,
    screen: "leaderboard",
  },
  {
    title: "Profile",
    icon: User,
    screen: "profile",
  },
  {
    title: "Connections",
    icon: Users,
    screen: "connection",
  },
  {
    title: "Test",
    icon: FileText,
    screen: "test",
  },
  {
    title: "Call",
    icon: Phone,
    screen: "call",
  },
];

export const AppSidebar = ({
  currentScreen,
  onScreenChange,
  className,
}: AppSidebarProps) => {
  const { user, logout } = useAuth();

  return (
    <Sidebar className={cn("border-r border-border/50 bg-gradient-to-br from-background via-background/98 to-card/80 backdrop-blur-sm", className)}>
      <SidebarHeader className="p-4 border-b border-border/30">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
            <Building2 className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-sm text-foreground">CareerQuest</h2>
            <p className="text-xs text-muted-foreground/70">Career Discovery</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-transparent">
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground/70">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.screen}>
                  <SidebarMenuButton
                    onClick={() => onScreenChange(item.screen)}
                    isActive={currentScreen === item.screen}
                    className={cn(
                      "w-full justify-start transition-all duration-200",
                      currentScreen === item.screen
                        ? "bg-primary/10 text-primary border-l-2 border-primary"
                        : "hover:bg-card/50 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border/30 bg-card/30">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-foreground">{user?.name?.toLowerCase() || "user"}</p>
            <p className="text-xs text-muted-foreground/70 truncate">{user?.email || ""}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-card/50 transition-colors"
        >
          <LogOut className="h-4 w-4 mr-2" />
          <span>Logout</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

