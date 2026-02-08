import { useState } from "react";
import { useMovies, ExtendedMovie } from "@/contexts/MovieContext";
import { Plus, Pencil, Trash2, Eye, Crown, Link } from "lucide-react";
import poster1 from "@/assets/poster-1.jpg";

const AdminMovies = () => {
  const { movies, addMovie, updateMovie, deleteMovie, publishMovie } = useMovies();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "", genre: "", year: new Date().getFullYear(), rating: 8.0,
    description: "", videoUrl: "", posterUrl: "", isAgent: false, isPublished: true, duration: "",
  });

  const resetForm = () => {
    setForm({ title: "", genre: "", year: new Date().getFullYear(), rating: 8.0, description: "", videoUrl: "", posterUrl: "", isAgent: false, isPublished: true, duration: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (m: ExtendedMovie) => {
    setForm({
      title: m.title, genre: m.genre || "", year: m.year || 2026, rating: m.rating || 8.0,
      description: m.description || "", videoUrl: m.videoUrl || "", posterUrl: m.poster || "", isAgent: m.isAgent || false, isPublished: m.isPublished !== false, duration: m.duration || "",
    });
    setEditingId(m.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMovie(editingId, { ...form, poster: form.posterUrl || poster1, type: "movie" } as any);
    } else {
      const newMovie: any = {
        id: `movie-${Date.now()}`,
        title: form.title, genre: form.genre, year: form.year, rating: form.rating,
        description: form.description, videoUrl: form.videoUrl, isAgent: form.isAgent,
        isPublished: form.isPublished, duration: form.duration,
        poster: form.posterUrl || poster1,
        type: "movie",
        uploadedAt: new Date().toISOString(),
        image: form.posterUrl || poster1, // Add image for compatibility
      };
      addMovie(newMovie);
    }
    resetForm();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Movies</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Movie
        </button>
      </div>

      {showForm && (
        <div className="bg-card rounded-xl border border-border p-4 mb-6">
          <h3 className="font-semibold text-foreground mb-4">{editingId ? "Edit Movie" : "Add Movie"}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="h-10 px-3 rounded-lg bg-secondary border border-border text-foreground text-sm" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <input className="h-10 px-3 rounded-lg bg-secondary border border-border text-foreground text-sm" placeholder="Genre (e.g. Action, Drama)" value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} required />
            <input type="number" className="h-10 px-3 rounded-lg bg-secondary border border-border text-foreground text-sm" placeholder="Year" value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} />
            <input type="number" step="0.1" className="h-10 px-3 rounded-lg bg-secondary border border-border text-foreground text-sm" placeholder="Rating" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} />
            <input className="h-10 px-3 rounded-lg bg-secondary border border-border text-foreground text-sm" placeholder="Duration (e.g. 2h 15m)" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
            <div className="md:col-span-2">
              <label className="block text-xs text-muted-foreground mb-1.5 flex items-center gap-1">
                <Link className="w-3 h-3" /> Poster Image URL
              </label>
              <input 
                className="w-full h-10 px-3 rounded-lg bg-secondary border border-border text-foreground text-sm" 
                placeholder="https://example.com/poster.jpg" 
                value={form.posterUrl} 
                onChange={(e) => setForm({ ...form, posterUrl: e.target.value })} 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-muted-foreground mb-1.5 flex items-center gap-1">
                <Link className="w-3 h-3" /> Video URL (.mp4 or streaming link)
              </label>
              <input 
                className="w-full h-10 px-3 rounded-lg bg-secondary border border-border text-foreground text-sm" 
                placeholder="https://example.com/movie.mp4" 
                value={form.videoUrl} 
                onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} 
              />
            </div>
            <textarea className="px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm md:col-span-2" placeholder="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <div className="flex items-center gap-4 md:col-span-2">
              <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                <input type="checkbox" checked={form.isAgent} onChange={(e) => setForm({ ...form, isAgent: e.target.checked })} className="rounded" />
                Agent Exclusive
              </label>
              <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} className="rounded" />
                Published
              </label>
            </div>
            <div className="flex gap-2 md:col-span-2">
              <button type="submit" className="px-6 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-medium">
                {editingId ? "Update" : "Add"}
              </button>
              <button type="button" onClick={resetForm} className="px-6 py-2 rounded-lg bg-secondary text-foreground text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 text-muted-foreground font-medium">Title</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Genre</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Year</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Video</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Status</th>
                <th className="text-right p-3 text-muted-foreground font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((m) => (
                <tr key={m.id} className="border-b border-border last:border-0 hover:bg-secondary/30">
                  <td className="p-3 text-foreground font-medium">{m.title}</td>
                  <td className="p-3 text-muted-foreground">{m.genre}</td>
                  <td className="p-3 text-muted-foreground">{m.year}</td>
                  <td className="p-3 text-muted-foreground">
                    {m.videoUrl ? (
                      <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 flex items-center gap-1 w-fit">
                        <Link className="w-3 h-3" /> Linked
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground/50">No video</span>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1.5">
                      {m.isAgent && <Crown className="w-3.5 h-3.5 text-amber-400" />}
                      {m.isPublished ? (
                        <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">Published</span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">Draft</span>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-end gap-1">
                      {!m.isPublished && (
                        <button onClick={() => publishMovie(m.id)} className="p-1.5 rounded hover:bg-secondary text-emerald-400" title="Publish">
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      <button onClick={() => handleEdit(m)} className="p-1.5 rounded hover:bg-secondary text-primary" title="Edit">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteMovie(m.id)} className="p-1.5 rounded hover:bg-secondary text-destructive" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminMovies;
