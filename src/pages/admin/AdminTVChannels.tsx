import { useState } from "react";
import { useMovies } from "@/contexts/MovieContext";
import { Plus, Trash2, Edit2, Play, Image as ImageIcon } from "lucide-react";

const AdminTVChannels = () => {
  const { tvChannels, addTVChannel, updateTVChannel, deleteTVChannel } = useMovies();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    streamUrl: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateTVChannel(editingId, formData);
      setEditingId(null);
    } else {
      addTVChannel({
        ...formData,
        id: Date.now().toString(),
        isPublished: true,
      });
    }
    setFormData({ title: "", image: "", streamUrl: "" });
    setShowAddForm(false);
  };

  const handleEdit = (channel: any) => {
    setFormData({
      title: channel.title,
      image: channel.image,
      streamUrl: channel.streamUrl,
    });
    setEditingId(channel.id);
    setShowAddForm(true);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Live TV Channels</h1>
          <p className="text-muted-foreground text-sm">Manage live stream channels and their content</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({ title: "", image: "", streamUrl: "" });
            setShowAddForm(!showAddForm);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg gradient-primary text-white font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          {showAddForm ? "Cancel" : "Add New Channel"}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 mb-8 max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-1.5">Channel Name</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full h-10 px-3 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="e.g. CNN Live, BBC News"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" /> Poster Image URL
              </label>
              <input
                type="url"
                required
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full h-10 px-3 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5 flex items-center gap-2">
                <Play className="w-4 h-4" /> Stream Link (HLS/MP4)
              </label>
              <input
                type="url"
                required
                value={formData.streamUrl}
                onChange={(e) => setFormData({ ...formData, streamUrl: e.target.value })}
                className="w-full h-10 px-3 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="https://...m3u8"
              />
            </div>
          </div>
          <div className="mt-6">
            <button
              type="submit"
              className="w-full h-10 rounded-lg gradient-primary text-white font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              {editingId ? "Update Channel" : "Save Channel"}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tvChannels.map((channel) => (
          <div key={channel.id} className="bg-card border border-border rounded-xl overflow-hidden group">
            <div className="aspect-video relative overflow-hidden bg-secondary">
              <img src={channel.image} alt={channel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(channel)}
                  className="p-1.5 rounded-lg bg-background/80 backdrop-blur-sm text-foreground hover:text-primary transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => { if(confirm("Delete this channel?")) deleteTVChannel(channel.id); }}
                  className="p-1.5 rounded-lg bg-background/80 backdrop-blur-sm text-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-foreground truncate">{channel.title}</h3>
              <p className="text-xs text-muted-foreground truncate mt-1">{channel.streamUrl}</p>
            </div>
          </div>
        ))}
        {tvChannels.length === 0 && !showAddForm && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            No TV channels added yet. Click "Add New Channel" to get started.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTVChannels;
