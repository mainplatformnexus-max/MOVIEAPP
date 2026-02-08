import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Film, Tv, Users, CreditCard, LayoutDashboard, Image, LogOut, ArrowLeft, Menu, Loader2, MonitorPlay
} from "lucide-react";

const adminNavItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { label: "Movies", icon: Film, path: "/admin/movies" },
  { label: "Series", icon: Tv, path: "/admin/series" },
  { label: "TV Channels", icon: MonitorPlay, path: "/admin/tv-channels" },
  { label: "Hero Carousel", icon: Image, path: "/admin/hero" },
  { label: "Users", icon: Users, path: "/admin/users" },
  { label: "Subscriptions", icon: CreditCard, path: "/admin/subscriptions" },
];

const AdminLayout = () => {
  const { user, isAdmin, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/login");
    }
  }, [loading, isAdmin, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Admin sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 bg-card border-r border-border transition-all duration-300 flex flex-col ${
          sidebarOpen ? "w-56" : "w-0 -translate-x-full"
        }`}
      >
        <div className="h-14 flex items-center gap-2 px-4 border-b border-border">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Film className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-foreground text-sm">Admin Panel</span>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "gradient-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border space-y-2">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Site
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-56" : "ml-0"}`}>
        <header className="sticky top-0 z-40 h-14 flex items-center px-4 bg-background/95 backdrop-blur-sm border-b border-border">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md hover:bg-secondary transition-colors mr-3"
          >
            <Menu className="w-5 h-5 text-foreground" />
          </button>
          <span className="text-sm text-muted-foreground">
            Welcome, {user?.name}
          </span>
        </header>
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
