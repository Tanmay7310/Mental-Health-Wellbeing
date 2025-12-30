import { useLocation, useNavigate } from "react-router-dom";
import { Activity, ClipboardList, Home, Phone } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", icon: Home, path: "/dashboard" },
  { label: "Assess", icon: ClipboardList, path: "/initial-screening" },
  { label: "Vitals", icon: Activity, path: "/vital-monitor" },
  { label: "Emergency", icon: Phone, path: "/emergency" },
];

export const MobileBottomNav = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();

  if (!isMobile) {
    return null;
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex w-full items-center justify-center px-4 pb-4">
      <div className="flex w-full max-w-md rounded-3xl border bg-background/95 p-2 shadow-lg shadow-primary/10 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname.startsWith(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2 text-xs font-medium transition",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted/80"
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};



