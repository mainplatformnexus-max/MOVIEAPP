import { useMemo } from "react";
import type { Episode } from "@/contexts/MovieContext";

type SeriesEpisodesPanelProps = {
  episodes: Episode[];
  selectedEpisodeId: string | null;
  onSelectEpisode: (episode: Episode) => void;
};

export default function SeriesEpisodesPanel({
  episodes,
  selectedEpisodeId,
  onSelectEpisode,
}: SeriesEpisodesPanelProps) {
  const seasons = useMemo(() => {
    const bySeason = new Map<number, Episode[]>();
    for (const ep of episodes) {
      const s = Number(ep.season);
      const list = bySeason.get(s) ?? [];
      list.push({ ...ep, season: s, episode: Number(ep.episode) });
      bySeason.set(s, list);
    }

    return Array.from(bySeason.entries())
      .sort(([a], [b]) => a - b)
      .map(([season, eps]) => ({
        season,
        episodes: eps.sort((a, b) => a.episode - b.episode),
      }));
  }, [episodes]);

  return (
    <>
      <h3 className="text-base font-bold text-foreground mb-1 sticky top-0 bg-card pb-1">
        Episodes
      </h3>
      {seasons.map(({ season, episodes: eps }) => (
        <div key={season} className="mb-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Season {season}
          </p>
          <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
            {eps.map((ep) => (
              <button
                key={ep.id}
                type="button"
                onClick={() => onSelectEpisode(ep)}
                className={`relative aspect-square rounded-lg flex items-center justify-center text-center transition-all text-sm font-bold ${
                  selectedEpisodeId === ep.id
                    ? "gradient-primary text-primary-foreground ring-2 ring-primary/50"
                    : "bg-secondary hover:bg-secondary/80 text-foreground"
                }`}
                aria-label={`Season ${season} Episode ${ep.episode}`}
                title={`S${season}E${ep.episode}`}
              >
                {ep.episode}
              </button>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
