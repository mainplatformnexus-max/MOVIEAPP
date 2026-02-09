import { useState } from "react";
import { useMovies, ExtendedMovie, Episode } from "@/contexts/MovieContext";
import { Plus, Pencil, Trash2, ChevronDown, ChevronUp, Link } from "lucide-react";
import poster1 from "@/assets/poster-1.jpg";

const AdminSeries = () => {
  const { series, episodes, addSeries, updateSeries, deleteSeries, addEpisode, deleteEpisode } = useMovies();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedSeries, setExpandedSeries] = useState<string | null>(null);
  const [showEpisodeForm, setShowEpisodeForm] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", genre: "", year: 2026, rating: 8.0, description: "", seasons: 1, poster: "" });
  const [epForm, setEpForm] = useState({ season: 1, episode: 1, title: "", videoUrl: "", duration: "" });

  const resetForm = () => { setForm({ title: "", genre: "", year: 2026, rating: 8.0, description: "", seasons: 1, poster: "" }); setEditingId(null); setShowForm(false); };

  const handleEdit = (s: ExtendedMovie) => {
    setForm({ title: s.title, genre: s.genre || "", year: s.year || 2026, rating: s.rating || 8.0, description: s.description || "", seasons: s.seasons || 1, poster: s.poster || "" });
    setEditingId(s.id); setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateSeries(editingId, { ...form, type: "series" } as any);
    } else {
      addSeries({ 
        id: `series-${Date.now()}`, 
        ...form, 
        type: "series", 
        isPublished: true, 
        isAgent: false, 
        uploadedAt: new Date().toISOString(),
        image: form.poster || poster1 // Add image mapping
      } as any);
    }
    resetForm();
  };

  const handleAddEpisode = (seriesId: string) => (e: React.FormEvent) => {
    e.preventDefault();
    addEpisode({ id: `ep-${Date.now()}`, seriesId, ...epForm });
    setEpForm({ season: 1, episode: 1, title: "", videoUrl: "", duration: "" });
    setShowEpisodeForm(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Series</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Series
        </button>
      </div>

      {showForm && (
        <div className="bg-card rounded-xl border border-border p-4 mb-6">
          <h3 className="font-semibold text-foreground mb-4">{editingId ? "Edit" : "Add"} Series</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="h-10 px-3 rounded-lg bg-secondary border border-border text-foreground text-sm" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <input className="h-10 px-3 rounded-lg bg-secondary border border-border text-foreground text-sm" placeholder="Genre" value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} required />
            <input type="number" className="h-10 px-3 rounded-lg bg-secondary border border-border text-foreground text-sm" placeholder="Year" value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} />
            <input type="number" className="h-10 px-3 rounded-lg bg-secondary border border-border text-foreground text-sm" placeholder="Seasons" value={form.seasons} onChange={(e) => setForm({ ...form, seasons: Number(e.target.value) })} />
            <input className="h-10 px-3 rounded-lg bg-secondary border border-border text-foreground text-sm" placeholder="Poster URL" value={form.poster} onChange={(e) => setForm({ ...form, poster: e.target.value })} />
            <textarea className="px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm md:col-span-2" placeholder="Description" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <div className="flex gap-2 md:col-span-2">
              <button type="submit" className="px-6 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-medium">{editingId ? "Update" : "Add"}</button>
              <button type="button" onClick={resetForm} className="px-6 py-2 rounded-lg bg-secondary text-foreground text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {series.map((s) => {
          const seriesEps = episodes.filter((e) => e.seriesId === s.id);
          const isExpanded = expandedSeries === s.id;
          return (
            <div key={s.id} className="bg-card rounded-xl border border-border">
              <div className="flex items-center justify-between p-4">
                <button onClick={() => setExpandedSeries(isExpanded ? null : s.id)} className="flex items-center gap-3 text-left flex-1">
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  <div>
                    <p className="font-medium text-foreground">{s.title}</p>
                    <p className="text-xs text-muted-foreground">{s.genre} • {seriesEps.length} episodes</p>
                  </div>
                </button>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleEdit(s)} className="p-1.5 rounded hover:bg-secondary text-primary"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => deleteSeries(s.id)} className="p-1.5 rounded hover:bg-secondary text-destructive"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-border p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-foreground">Episodes</h4>
                    <button onClick={() => setShowEpisodeForm(showEpisodeForm === s.id ? null : s.id)} className="text-xs px-3 py-1 rounded gradient-primary text-primary-foreground">
                      <Plus className="w-3 h-3 inline mr-1" />Add Episode
                    </button>
                  </div>

                  {showEpisodeForm === s.id && (
                    <form onSubmit={handleAddEpisode(s.id)} className="bg-secondary/50 rounded-lg p-3 mb-3 space-y-2">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        <input type="number" className="h-9 px-3 rounded-lg bg-secondary border border-border text-foreground text-xs" placeholder="Season" value={epForm.season} onChange={(e) => setEpForm({ ...epForm, season: Number(e.target.value) })} />
                        <input type="number" className="h-9 px-3 rounded-lg bg-secondary border border-border text-foreground text-xs" placeholder="Episode #" value={epForm.episode} onChange={(e) => setEpForm({ ...epForm, episode: Number(e.target.value) })} />
                        <input className="h-9 px-3 rounded-lg bg-secondary border border-border text-foreground text-xs" placeholder="Episode Title" value={epForm.title} onChange={(e) => setEpForm({ ...epForm, title: e.target.value })} required />
                      </div>
                      <div>
                        <label className="block text-[10px] text-muted-foreground mb-1 flex items-center gap-1">
                          <Link className="w-3 h-3" /> Episode Video URL
                        </label>
                        <input className="w-full h-9 px-3 rounded-lg bg-secondary border border-border text-foreground text-xs" placeholder="https://example.com/episode.mp4" value={epForm.videoUrl} onChange={(e) => setEpForm({ ...epForm, videoUrl: e.target.value })} />
                      </div>
                      <div className="flex gap-2">
                        <button type="submit" className="h-8 px-4 rounded-lg gradient-primary text-primary-foreground text-xs font-medium">Add Episode</button>
                        <button type="button" onClick={() => setShowEpisodeForm(null)} className="h-8 px-4 rounded-lg bg-secondary text-foreground text-xs">Cancel</button>
                      </div>
                    </form>
                  )}

                  {seriesEps.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No episodes yet</p>
                  ) : (
                    <div className="space-y-1">
                      {seriesEps.map((ep) => (
                        <div key={ep.id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-secondary/30">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-foreground">S{ep.season}E{ep.episode}</span>
                            <span className="text-sm text-muted-foreground">- {ep.title}</span>
                            {ep.videoUrl ? (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 truncate max-w-[150px]">{ep.videoUrl}</span>
                            ) : (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">No video</span>
                            )}
                          </div>
                          <button onClick={() => deleteEpisode(ep.id)} className="p-1 rounded hover:bg-secondary text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminSeries;
