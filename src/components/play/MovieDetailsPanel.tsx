import { Calendar, Clock, Film, Star } from "lucide-react";
import type { ExtendedMovie } from "@/contexts/MovieContext";
import PlayerActions from "@/components/play/PlayerActions";

type MovieDetailsPanelProps = {
  content: ExtendedMovie;
};

export default function MovieDetailsPanel({ content }: MovieDetailsPanelProps) {
  return (
    <>
      <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
        <Film className="w-5 h-5 text-primary" />
        Movie Details
      </h3>

      <div className="space-y-3">
        <div>
          <h4 className="text-lg font-bold text-foreground">{content.title}</h4>
          {content.isAgent && (
            <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-bold bg-accent text-accent-foreground">
              AGENT EXCLUSIVE
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          {content.year && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> {content.year}
            </span>
          )}
          {content.rating && (
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-rating-star fill-current" /> {content.rating}/10
            </span>
          )}
          {content.duration && (
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {content.duration}
            </span>
          )}
        </div>

        {content.genre && (
          <div className="flex flex-wrap gap-1.5">
            {content.genre.split(",").map((g, i) => (
              <span key={i} className="px-2 py-0.5 rounded text-xs bg-secondary text-foreground/80">
                {g.trim()}
              </span>
            ))}
          </div>
        )}

        {content.description && (
          <div className="pt-2 border-t border-border">
            <p className="text-sm text-foreground/70 leading-relaxed">{content.description}</p>
          </div>
        )}

        <PlayerActions title={content.title} url={content.videoUrl} />
      </div>
    </>
  );
}
