import { Download, Share2 } from "lucide-react";

type PlayerActionsProps = {
  title: string;
  url?: string;
};

export default function PlayerActions({ title, url }: PlayerActionsProps) {
  const canDownload = Boolean(url);

  const handleDownload = async (e: React.MouseEvent) => {
    if (!url) return;
    e.preventDefault();
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${title}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      // Fallback to direct link if fetch fails
      window.open(url, '_blank');
    }
  };

  return (
    <div className="flex gap-2 pt-3 border-t border-border">
      {canDownload && (
        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
      )}
      <button
        type="button"
        onClick={() => {
          const shareUrl = window.location.href;
          if (navigator.share) {
            navigator.share({ title, url: shareUrl });
          } else {
            navigator.clipboard.writeText(shareUrl);
          }
        }}
        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-secondary text-foreground font-medium text-sm hover:bg-secondary/80 transition-colors"
      >
        <Share2 className="w-4 h-4" />
        Share
      </button>
    </div>
  );
}
