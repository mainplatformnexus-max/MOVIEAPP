import { Home, Tv, Film, Crown, Calendar, Search } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const navItems = [
  { label: "Home", icon: Home, href: "/" },
  { label: "TV", icon: Tv, href: "/tv-shows" },
  { label: "Movies", icon: Film, href: "/movies" },
  { label: "Live TV", icon: Tv, href: "/tv-channels" },
  { label: "Agent", icon: Crown, href: "/agent" },
];

export function MobileNavBar() {
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md">
      <nav className="flex items-center justify-around p-2 bg-sidebar/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl ring-1 ring-white/20">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.href}
              end={item.href === "/"}
              className={({ isActive }) =>
                `relative flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 group ${
                  isActive
                    ? "text-primary scale-110"
                    : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-6 h-6 transition-transform ${isActive ? "drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" : "group-hover:scale-110"}`} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                  {isActive && (
                    <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary animate-pulse" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
