import { useState, useEffect } from "react";
import MovieBoxHeader from "@/components/MovieBoxHeader";
import MovieBoxSidebar from "@/components/MovieBoxSidebar";
import HeroCarousel from "@/components/HeroCarousel";
import MovieSection from "@/components/MovieSection";
import { useMovies } from "@/contexts/MovieContext";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { movies, series } = useMovies();

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  const publishedMovies = movies.filter((m) => m.isPublished !== false && !m.isAgent);
  const publishedSeries = series.filter((s) => s.isPublished !== false);

  // Group movies by genre
  const trendingMovies = publishedMovies.slice(0, 10);
  const actionMovies = publishedMovies.filter((m) => m.genre?.includes("Action")).slice(0, 10);
  const animationMovies = publishedMovies.filter((m) => m.genre?.includes("Animation")).slice(0, 10);
  const mostWatched = [...publishedMovies].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 10);

  return (
    <div className="min-h-screen bg-background">
      <MovieBoxHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <MovieBoxSidebar isOpen={sidebarOpen} />

      <main
        className={`pt-14 transition-all duration-300 ${
          sidebarOpen && !isMobile ? "ml-48" : "ml-0"
        }`}
      >
        <div className="p-4 md:p-6">
          <HeroCarousel />

          <div className="mt-6 md:mt-8">
            {publishedSeries.length > 0 && (
              <MovieSection title="Popular Series" movies={publishedSeries} />
            )}
            {trendingMovies.length > 0 && (
              <MovieSection title="Trending Movies" movies={trendingMovies} />
            )}
            {actionMovies.length > 0 && (
              <MovieSection title="Action" movies={actionMovies} />
            )}
            {animationMovies.length > 0 && (
              <MovieSection title="Animation" movies={animationMovies} />
            )}
            {mostWatched.length > 0 && (
              <MovieSection title="Most Watched" movies={mostWatched} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
