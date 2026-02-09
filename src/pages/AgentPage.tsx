import { useMovies } from "@/contexts/MovieContext";
import { useAuth } from "@/contexts/AuthContext";
import MovieBoxHeader from "@/components/MovieBoxHeader";
import MovieBoxSidebar from "@/components/MovieBoxSidebar";
import MovieGrid from "@/components/MovieGrid";
import { useState, useEffect } from "react";
import { Crown, Lock } from "lucide-react";
import SubscriptionModal from "@/components/SubscriptionModal";
import LoginModal from "@/components/LoginModal";
import { useIsMobile } from "@/hooks/use-mobile";

const AgentPage = () => {
  const isMobile = useIsMobile();
  const { movies } = useMovies();
  const { hasAgentAccess, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Agent movies: latest uploaded + agent-exclusive content
  const agentMovies = movies
    .filter((m) => m.isAgent || !m.isPublished)
    .sort((a, b) => new Date(b.uploadedAt || "").getTime() - new Date(a.uploadedAt || "").getTime());

  // Also show recently uploaded movies
  const latestUploaded = movies
    .sort((a, b) => new Date(b.uploadedAt || "").getTime() - new Date(a.uploadedAt || "").getTime())
    .slice(0, 20);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  return (
    <div className="min-h-screen bg-background">
      <MovieBoxHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <MovieBoxSidebar isOpen={sidebarOpen} />
      <main className={`pt-14 transition-all duration-300 ${sidebarOpen && !isMobile ? "ml-48" : "ml-0"}`}>
        <div className="p-4 md:p-6 pb-24 md:pb-6">
          <div className="flex items-center gap-3 mb-6">
            <Crown className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl font-bold text-foreground">Agent - Early Access</h1>
          </div>

          {!isAuthenticated ? (
            <div className="flex items-center justify-center min-h-[40vh] mb-8 bg-card/50 rounded-2xl border border-dashed border-border">
              <div className="text-center p-8">
                <Lock className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-lg font-bold text-foreground mb-2">Login Required</h2>
                <p className="text-sm text-muted-foreground mb-4">Please login to access and play Agent content</p>
                <button 
                  onClick={() => setShowLoginModal(true)} 
                  className="px-6 py-2 rounded-lg gradient-primary text-primary-foreground font-semibold text-sm"
                >
                  Login
                </button>
              </div>
            </div>
          ) : !hasAgentAccess ? (
            <div className="flex items-center justify-center min-h-[40vh] mb-8 bg-card/50 rounded-2xl border border-dashed border-border">
              <div className="text-center p-8 max-w-md">
                <Crown className="w-10 h-10 text-amber-400 mx-auto mb-4" />
                <h2 className="text-lg font-bold text-foreground mb-2">Agent Subscription Required</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Get early access to play the latest movies before they're published to everyone.
                </p>
                <button
                  onClick={() => setShowSubscriptionModal(true)}
                  className="px-6 py-2 rounded-lg gradient-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  Get Agent Plan
                </button>
              </div>
            </div>
          ) : null}

          {agentMovies.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-bold text-foreground mb-4">🔥 Agent Exclusive</h2>
              <MovieGrid movies={agentMovies} />
            </div>
          )}

          <div>
            <h2 className="text-lg font-bold text-foreground mb-4">📽 Latest Uploads</h2>
            <MovieGrid movies={latestUploaded} />
          </div>
        </div>
      </main>
      <SubscriptionModal 
        isOpen={showSubscriptionModal} 
        onClose={() => setShowSubscriptionModal(false)} 
      />
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </div>
  );
};

export default AgentPage;
