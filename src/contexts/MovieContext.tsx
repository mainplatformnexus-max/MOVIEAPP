import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { database } from "@/lib/firebase";
import { ref, set, onValue, remove, update } from "firebase/database";
import type { Movie, HeroSlide } from "@/data/movies";
import {
  heroSlides as defaultHeroSlides,
  popularSeries as defaultPopularSeries,
  trendingMovies as defaultTrendingMovies,
  nollywoodMovies as defaultNollywoodMovies,
  animationMovies as defaultAnimationMovies,
  mostWatched as defaultMostWatched,
} from "@/data/movies";

export interface Episode {
  id: string;
  seriesId: string;
  season: number;
  episode: number;
  title: string;
  videoUrl: string;
  streamlink?: string;
  duration?: string;
}

export interface ExtendedMovie extends Omit<Movie, 'type'> {
  description?: string;
  videoUrl?: string;
  streamlink?: string;
  type?: "movie" | "series";
  isAgent?: boolean;
  isPublished?: boolean;
  uploadedAt?: string;
  duration?: string;
  seasons?: number;
}

export interface TVChannel {
  id: string;
  title: string;
  image: string;
  streamUrl: string;
  isPublished?: boolean;
}

interface MovieContextType {
  movies: ExtendedMovie[];
  series: ExtendedMovie[];
  episodes: Episode[];
  heroSlides: HeroSlide[];
  agentMovies: ExtendedMovie[];
  tvChannels: TVChannel[];
  addMovie: (movie: ExtendedMovie) => void;
  updateMovie: (id: string, updates: Partial<ExtendedMovie>) => void;
  deleteMovie: (id: string) => void;
  addSeries: (s: ExtendedMovie) => void;
  updateSeries: (id: string, updates: Partial<ExtendedMovie>) => void;
  deleteSeries: (id: string) => void;
  addEpisode: (ep: Episode) => void;
  deleteEpisode: (id: string) => void;
  addHeroSlide: (slide: HeroSlide) => void;
  updateHeroSlide: (id: string, updates: Partial<HeroSlide>) => void;
  deleteHeroSlide: (id: string) => void;
  addTVChannel: (channel: TVChannel) => void;
  updateTVChannel: (id: string, updates: Partial<TVChannel>) => void;
  deleteTVChannel: (id: string) => void;
  publishMovie: (id: string) => void;
  searchContent: (query: string) => ExtendedMovie[];
  loading: boolean;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

function getDefaultMovies(): ExtendedMovie[] {
  return [
    ...defaultTrendingMovies,
    ...defaultNollywoodMovies,
    ...defaultAnimationMovies,
    ...defaultMostWatched,
  ].map((m) => ({
    ...m,
    isPublished: true,
    isAgent: false,
    videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4",
    description: `Watch ${m.title} - an exciting ${m.category || m.genre} experience.`,
    uploadedAt: new Date().toISOString(),
  }));
}

function getDefaultSeries(): ExtendedMovie[] {
  return defaultPopularSeries.map((s) => ({
    ...s,
    id: String(s.id),
    type: "series",
    isPublished: true,
    isAgent: false,
    videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4",
    description: `Watch ${s.title} series.`,
    uploadedAt: new Date().toISOString(),
    seasons: 1,
  }));
}

function getDefaultEpisodes(): Episode[] {
  return defaultPopularSeries.map((s) => ({
    id: `ep-${s.id}-s1e1`,
    seriesId: String(s.id),
    season: 1,
    episode: 1,
    title: `${s.title} - S1E1 Pilot`,
    videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4",
  }));
}

export const MovieProvider = ({ children }: { children: ReactNode }) => {
  const [movies, setMovies] = useState<ExtendedMovie[]>([]);
  const [series, setSeries] = useState<ExtendedMovie[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [heroSlidesState, setHeroSlides] = useState<HeroSlide[]>(defaultHeroSlides);
  const [tvChannels, setTVChannels] = useState<TVChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Load movies from Firebase
  useEffect(() => {
    const moviesRef = ref(database, "movies");
    const unsubscribe = onValue(moviesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const moviesList = Object.keys(data).map((key) => ({
          ...data[key],
          id: key,
          type: (data[key].type as "movie" | "series") || "movie"
        }));
        setMovies(moviesList);
      } else {
        setMovies([]);
      }
      setLoading(false);
      setInitialized(true);
    });

    return () => unsubscribe();
  }, []);

  // Load series from Firebase
  useEffect(() => {
    const seriesRef = ref(database, "series");
    const unsubscribe = onValue(seriesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const seriesList = Object.keys(data).map((key) => ({
          ...data[key],
          id: key,
          type: "series" as const
        }));
        setSeries(seriesList);
      } else {
        setSeries([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Load episodes from Firebase
  useEffect(() => {
    const episodesRef = ref(database, "episodes");
    const unsubscribe = onValue(episodesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const episodesList = Object.keys(data).map((key) => ({
          ...data[key],
          id: key,
        }));
        setEpisodes(episodesList);
      } else {
        setEpisodes([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Load hero slides from Firebase
  useEffect(() => {
    const heroRef = ref(database, "heroSlides");
    const unsubscribe = onValue(heroRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const slidesList = Object.keys(data).map((key) => ({
          ...data[key],
          id: key,
        }));
        setHeroSlides(slidesList);
      } else {
        setHeroSlides([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Load TV Channels from Firebase
  useEffect(() => {
    const channelsRef = ref(database, "tvChannels");
    const unsubscribe = onValue(channelsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const channelsList = Object.keys(data).map((key) => ({
          ...data[key],
          id: key,
        }));
        setTVChannels(channelsList);
      } else {
        setTVChannels([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const agentMovies = movies.filter((m) => m.isAgent && !m.isPublished);

  const addTVChannel = async (channel: TVChannel) => {
    await set(ref(database, `tvChannels/${channel.id}`), channel);
  };

  const updateTVChannel = async (id: string, updates: Partial<TVChannel>) => {
    await update(ref(database, `tvChannels/${id}`), updates);
  };

  const deleteTVChannel = async (id: string) => {
    await remove(ref(database, `tvChannels/${id}`));
  };

  const addMovie = async (movie: ExtendedMovie) => {
    await set(ref(database, `movies/${movie.id}`), movie);
  };

  const updateMovie = async (id: string, updates: Partial<ExtendedMovie>) => {
    await update(ref(database, `movies/${id}`), updates);
  };

  const deleteMovie = async (id: string) => {
    await remove(ref(database, `movies/${id}`));
  };

  const publishMovie = async (id: string) => {
    await update(ref(database, `movies/${id}`), { isPublished: true, isAgent: false });
  };

  const addSeries = async (s: ExtendedMovie) => {
    await set(ref(database, `series/${s.id}`), s);
  };

  const updateSeries = async (id: string, updates: Partial<ExtendedMovie>) => {
    await update(ref(database, `series/${id}`), updates);
  };

  const deleteSeries = async (id: string) => {
    await remove(ref(database, `series/${id}`));
    // Also remove series episodes
    const seriesEpisodes = episodes.filter((e) => e.seriesId === id);
    for (const ep of seriesEpisodes) {
      await remove(ref(database, `episodes/${ep.id}`));
    }
  };

  const addEpisode = async (ep: Episode) => {
    await set(ref(database, `episodes/${ep.id}`), ep);
  };

  const deleteEpisode = async (id: string) => {
    await remove(ref(database, `episodes/${id}`));
  };

  const addHeroSlide = async (slide: HeroSlide) => {
    await set(ref(database, `heroSlides/${slide.id}`), slide);
  };

  const updateHeroSlide = async (id: string, updates: Partial<HeroSlide>) => {
    await update(ref(database, `heroSlides/${id}`), updates);
  };

  const deleteHeroSlide = async (id: string) => {
    await remove(ref(database, `heroSlides/${id}`));
  };

  const searchContent = (query: string): ExtendedMovie[] => {
    const q = query.toLowerCase();
    const allContent = [...movies, ...series];
    return allContent.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.genre?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q)
    );
  };

  return (
    <MovieContext.Provider
      value={{
        movies,
        series,
        episodes,
        heroSlides: heroSlidesState,
        agentMovies,
        addMovie,
        updateMovie,
        deleteMovie,
        addSeries,
        updateSeries,
        deleteSeries,
        addEpisode,
        deleteEpisode,
        addHeroSlide,
        updateHeroSlide,
        deleteHeroSlide,
        addTVChannel,
        updateTVChannel,
        deleteTVChannel,
        publishMovie,
        searchContent,
        loading,
        tvChannels,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export const useMovies = () => {
  const context = useContext(MovieContext);
  if (!context) throw new Error("useMovies must be used within MovieProvider");
  return context;
};
