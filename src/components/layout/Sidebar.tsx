import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Beef,
  BookOpen,
  Phone,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/proteins", label: "Proteínas", icon: Beef },
  { to: "/recipes", label: "Receitas", icon: BookOpen },
  { to: "/phone-numbers", label: "Números", icon: Phone },
  { to: "/messages", label: "Mensagens", icon: MessageSquare },
];

export function Sidebar() {
  const collapsed = useAppStore((s) => s.sidebarCollapsed);
  const mobileSidebarOpen = useAppStore((s) => s.mobileSidebarOpen);
  const toggle = useAppStore((s) => s.toggleSidebar);
  const closeMobileSidebar = useAppStore((s) => s.closeMobileSidebar);

  return (
    <>
      <aside
        className={cn(
          "hidden h-svh flex-col border-r bg-background transition-all duration-300 md:flex",
          collapsed ? "w-16" : "w-60"
        )}
      >
        <div className="flex h-14 items-center justify-between px-4">
          {!collapsed && <span className="text-lg font-bold">Daily Recipe</span>}
          <Button variant="ghost" size="icon" onClick={toggle} className="ml-auto">
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        <Separator />

        <nav className="flex-1 space-y-1 p-2">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                  collapsed && "justify-center px-2"
                )
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden",
          mobileSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={closeMobileSidebar}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r bg-background transition-transform duration-300 md:hidden",
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-14 items-center justify-between px-4">
          <span className="text-lg font-bold">Daily Recipe</span>
          <Button variant="ghost" size="icon" onClick={closeMobileSidebar}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Separator />

        <nav className="flex-1 space-y-1 p-2">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={closeMobileSidebar}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                )
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
