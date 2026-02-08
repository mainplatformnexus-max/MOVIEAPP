import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { MovieProvider } from "@/contexts/MovieContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
// SubscriptionPage removed - now using modal
import PlayPage from "./pages/PlayPage";
import TVShows from "./pages/TVShows";
import MoviesPage from "./pages/MoviesPage";
import TVChannels from "./pages/TVChannels";
import AgentPage from "./pages/AgentPage";
import UpcomingPage from "./pages/UpcomingPage";
import SearchResults from "./pages/SearchResults";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminMovies from "./pages/admin/AdminMovies";
import AdminSeries from "./pages/admin/AdminSeries";
import AdminTVChannels from "./pages/admin/AdminTVChannels";
import AdminHero from "./pages/admin/AdminHero";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSubscriptions from "./pages/admin/AdminSubscriptions";
import { MobileNavBar } from "@/components/MobileNavBar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <MovieProvider>
            <div className="relative min-h-screen">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                {/* Subscription route removed - using modal */}
                <Route path="/play/:id" element={<PlayPage />} />
                <Route path="/tv-shows" element={<TVShows />} />
                <Route path="/movies" element={<MoviesPage />} />
                <Route path="/tv-channels" element={<TVChannels />} />
                <Route path="/agent" element={<AgentPage />} />
                <Route path="/upcoming" element={<UpcomingPage />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="movies" element={<AdminMovies />} />
                  <Route path="series" element={<AdminSeries />} />
                  <Route path="tv-channels" element={<AdminTVChannels />} />
                  <Route path="hero" element={<AdminHero />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="subscriptions" element={<AdminSubscriptions />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
              <MobileNavBar />
            </div>
          </MovieProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
